import config from '@/../public/config';
import StellarSdk from 'stellar-sdk';

export const mapPayment = ({
    id,
    amount,
    created_at,
    from,
    to,
    asset_code,
    rawPayment,
    account_id,
}) => {
    return {
        id,
        amount,
        created_at: created_at,
        from,
        to,
        asset_code,
        fee: 0.1,
        outgoing: account_id === from,
        memo: getMemoClosure(rawPayment),
        rawPayment,
        type: 'payment',
    };
};

export const fetchPayments = async (id, cursor = 'now') => {
    /** @type Server */
    const server = new StellarSdk.Server(config.stellarServerUrl);

    /** @type {ServerApi.CollectionPage<ServerApi.Response>} */
    const allPayloadObj = await server
        .operations()
        .forAccount(id)
        .cursor(cursor)
        .limit(100)
        .order('desc')
        .call();

    const mappedAllPayloadObj = allPayloadObj.records.reduce(
        /**
         * @param {*[]} acc
         * @param {ServerApi.BaseOperationRecord} record
         */
        (acc, record) => {
            switch (record.type) {
                case 'payment':
                    if (record.to === config.tftFundAccount) {
                        return acc;
                    }

                    const payment = mapPayment({
                        ...record,
                        account_id: id,
                        rawPayment: record,
                    });
                    acc.push(payment);
                    break;
                case 'change_trust':
                    /** @type {ChangeTrustOperationResponse} record */
                    const trust = {
                        id: record.id,
                        amount: 0,
                        created_at: record.created_at,
                        from: record.account_id,
                        to: record.account_id,
                        asset_code: record.asset_code,
                        fee: 0.1,
                        outgoing: true,
                        memo: () => 'trust',
                        account_id: id,
                        rawPayment: record,
                        type: 'trust',
                    };

                    acc.push(trust);
                    break;
                case 'manage_buy_offer':
                    if (!record.transaction_successful) {
                        break;
                    }
                    const buy = {
                        id: record.id,
                        amount: record.amount,
                        created_at: record.created_at,
                        from: record.account_id,
                        to: record.account_id,
                        asset_code: record.buying_asset_code,
                        fee: 0.1,
                        outgoing: true,
                        memo: () => 'trust',
                        account_id: id,
                        rawPayment: record,
                        type: 'buy',
                    };

                    acc.push(buy);
                    break;
                case 'create_account':
                    break;
                default:
                    const skip = {
                        id: record.id,
                        amount: 0,
                        created_at: record.created_at,
                        from: record.id,
                        to: record.id,
                        asset_code: 'XLM',
                        fee: 0.1,
                        outgoing: true,
                        memo: () => 'skip',
                        account_id: id,
                        rawPayment: record,
                        type: 'skip',
                    };

                    acc.push(skip);
                    break;
            }

            return acc;
        },
        []
    );
    return mappedAllPayloadObj;
};

const getMemoClosure = rawPayment => {
    let memo;
    return async () => {
        if (memo) {
            return memo;
        }
        let transaction = await rawPayment.transaction();
        memo = transaction.memo;
        return memo;
    };
};

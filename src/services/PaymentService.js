import config from '../../public/config';
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
    };
};

export const fetchPayments = async (id, cursor = 'now') => {
    const server = new StellarSdk.Server(config.stellarServerUrl);
    const paymentPayloadObj = await server
        .payments()
        .forAccount(id)
        .cursor(cursor)
        .limit(100)
        .order('desc')
        .call();

    return paymentPayloadObj.records
        .filter(p => p.type === 'payment')
        .filter(p => p.to !== config.tftFundAccount)
        .map(p => mapPayment({ ...p, account_id: id, rawPayment: p }));
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

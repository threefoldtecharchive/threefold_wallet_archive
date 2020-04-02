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
        .limit(15)
        .order('desc')
        .call();

    return paymentPayloadObj.records
        .filter(p => p.type === 'payment')
        .filter(
            p =>
                p.to !==
                'GAKONCKYJ7PRRKBZSWVPG3MURUNX4H44AB3CU2YGVKF2FD7KXJBB3XID'
        )
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

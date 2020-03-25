import config from '../../public/config';
import StellarSdk from 'stellar-sdk';

export const mapPayment = ({
    id,
    amount,
    created_at,
    from,
    to,
    asset_code,
    payment,
    fee,
    account_id,
}) => {
    return {
        id,
        amount,
        created_at: created_at,
        from,
        to,
        asset_code,
        outgoing: account_id === from,
        memo: getMemoClosure(payment),
        fee,
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

    const rawPayments = paymentPayloadObj.records;

    const mappedPaymentsPromises = rawPayments
        .filter(p => p.type === 'payment')
        .map(async p => {
            // const { memo, fee_charged } = await p.transaction();
            const fee = 0.1;
            return mapPayment({ ...p, account_id: id, fee, payment: p });
        });
    const mappedPayments = await Promise.all(mappedPaymentsPromises);
    return mappedPayments;
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

import { getConfig } from '@jimber/stellar-crypto';
import { Server } from 'stellar-sdk';

export const checkVesting = async publicKey => {
    /**  @type {Server}*/
    let server;
    ({ server } = getConfig());

    const accountsThatWhereIsSigner = (
        await server.accounts().forSigner(publicKey).limit(200).call()
    ).records;

    const accountsThatWhereIsSignerAndIsNotMe = accountsThatWhereIsSigner.filter(
        acc => acc.account_id !== publicKey
    );

    return accountsThatWhereIsSignerAndIsNotMe.find(acc => {
        return false;
    });
    // return accountsThatWhereIsSignerAndIsNotMe.find(acc => acc.data);
};

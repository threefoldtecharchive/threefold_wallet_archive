import config from '../../public/config';
import Pkid from '@jimber/pkid';
import sodium from 'libsodium-wrappers';

export const migrateToPkid = async ({ seed, importedWallets, appWallets }) => {
    await sodium.ready;

    const keyPair = sodium.crypto_sign_seed_keypair(seed);

    const client = new Pkid(config.pkidUrl, keyPair);

    const promises = [];

    const appData = await client.getDoc(client.keyPair.publicKey, 'wallets');

    if (!appData.data && appWallets) {
        const AppAccounts = appWallets.map((account, index) => {
            return {
                walletName: account.walletName,
                position: index + 2, // don't worry about it
                index: index + 2,
                stellar: false,
            };
        });

        const pkidAppAccounts = [
            {
                walletName: 'Daily',
                index: 0,
                position: 0,
                stellar: false,
            },
            {
                walletName: 'savings',
                index: 1,
                position: 1,
                stellar: false,
            },
            ...AppAccounts,
        ];

        promises.push(client.setDoc('wallets', pkidAppAccounts, true));

        const ImportedAccounts = importedWallets.map((account, index) => {
            return {
                walletName: account.walletName,
                seed: account.seed,
                stellar: false,
                position: index + pkidAppAccounts.length,
            };
        });
        promises.push(
            client.setDoc('imported_accounts', ImportedAccounts, true)
        );
    }
    await Promise.all(promises);
};

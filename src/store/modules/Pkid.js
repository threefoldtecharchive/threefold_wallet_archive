import config from '@/../public/config';
import Pkid from '@jimber/pkid';
import sodium from 'libsodium-wrappers';
import router from '@/router';

export default {
    state: {
        client: null,
        // mostly for debug purposes
        pkidApp: null,
        pkidImported: null,
    },
    actions: {
        async saveToPkid({ getters, dispatch }) {
            const appAccounts = getters.appAccounts.map(account => ({
                walletName: account.name,
                position: account.position,
                index: account.index,
                stellar: true,
                isConverted: account.isConverted
            }));
            if (appAccounts.length <= 0) {
                // should be a mistake
                // @todo: look if exception is better, hint: probably
                console.log('not saved to pkid due to no accounts ');
                return;
            }
            const appPromise = dispatch('persistPkidAppAccounts', appAccounts);
            const importedAccounts = getters.importedAccounts.map(account => ({
                walletName: account.name,
                seed: account.seed,
                stellar: true,
                isConverted: account.isConverted,
                index: account.index
            }));
            const importedPromise = dispatch(
                'persistPkidImportedAccounts',
                importedAccounts
            );
            await Promise.all([appPromise, importedPromise]);
        },
        async persistPkidAppAccounts({ getters }, accounts) {
            // key 'wallets' for historic reasons
            await getters.client.setDoc('wallets', accounts, true);
        },
        async setPkidClient({ commit }, seed) {
            await sodium.ready;

            const keyPair = sodium.crypto_sign_seed_keypair(seed);

            const client = new Pkid(config.pkidUrl, keyPair);
            commit('setPkidClient', client);
        },
        async fetchPkidAppAccounts({ commit, dispatch }) {
            let data = await dispatch('fetchPkidDocument', 'wallets');
            if (!data) {
                // probably 404
                return null;
            }

            commit('setPkidApp', data);

            return data.data;
        },
        async persistPkidImportedAccounts({ getters }, accounts) {
            await getters.client.setDoc('imported_accounts', accounts, true);
        },
        async fetchPkidDocument({ getters }, documentKey) {
            const client = getters.client;
            const data = await client.getDoc(
                client.keyPair.publicKey,
                documentKey
            );

            if (data.success) {
                return data;
            }
            if (data.status === 404) {
                return null;
            }
            router.push({
                name: 'error screen',
                params: {
                    reason: 'There seems to be a problem with our services',
                    fix: 'Try again later',
                },
            });
            // @todo: handel this situation
            throw new Error('something is wrong with Pkid connection');
        },
        async fetchPkidImportedAccounts({ commit, dispatch }) {
            let data = await dispatch('fetchPkidDocument', 'imported_accounts');
            if (!data) {
                // probably 404
                return null;
            }

            commit('setPkidImported', data);
            return data.data;
        },
        async addImportedWallet({ dispatch }, postMessage) {
            const wallets = await dispatch('fetchPkidImportedAccounts');
            await dispatch('setPkidImportedWallets', [...wallets, postMessage]);
        },
        async updatePkidAccounts(context) {
            // @todo
        },
    },
    mutations: {
        setPkidClient(state, payload) {
            state.client = payload;
        },
        setPkidApp(state, pkidApp) {
            state.pkidApp = pkidApp;
        },
        setPkidImported(state, pkidImported) {
            state.pkidImported = pkidImported;
        },
    },
    getters: {
        client: state => state.client,
        pkidApp: state => state.pkidApp,
        pkidImported: state => state.pkidImported,
    },
};

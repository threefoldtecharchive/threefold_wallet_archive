import { fetchAccount, mapAccount } from '../../services/AccountService';
import { mapPayment } from '../../services/PaymentService';
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39';
import { convertTfAccount } from '@jimber/stellar-crypto';
import config from '../../../public/config';
import StellarSdk, { Server } from 'stellar-sdk';
import router from '../../router';

export default {
    state: {
        threeBotName: null,
        appSeedPhrase: null,
        isLoadingWallets: true,
        isMigratingAccount: false,
        position: 0,
        initialized: false,
        fee: StellarSdk.BASE_FEE,
        appLoadingStack: 0,
    },
    actions: {
        async initializeTransactionWatcher({ commit, dispatch }, account) {
            const server = new Server(config.stellarServerUrl);
            server
                .payments()
                .forAccount(account.id)
                .cursor('now')
                .stream({
                    onmessage: message => {
                        const fee = 0.1;

                        const payment = mapPayment({
                            ...message,
                            account_id: account.id,
                            fee,
                            payment: message
                        });

                        commit('addPayments', {
                            payments: [payment],
                            id: account.id,
                        });

                        // We need to relocate this or manage to get a reference to flashmessage in here which feels a bit dirty.
                        // this.$flashMessage.info(`Successfully received ${payment.amount} ${payment.asset_code} from ${account.id}.`);

                        console.log(`${account.id} updated `);
                        // dispatch('reloadAccount', account.id);
                    },
                    onerror: e => {
                        console.error(e);
                    },
                });
        },
        async initializeAccountWatcher({ commit, getters }, account) {
            const server = new Server(config.stellarServerUrl);
            server
                .accounts()
                .accountId(account.id)
                .cursor('now')
                .stream({
                    onmessage: message => {
                        mapAccount({
                            ...getters.accounts.find(a => a.id === account.id),
                            accountResponse: message,
                            // seed: Buffer.from(mnemonicToEntropy(account.seedPhrase), 'hex'),
                        }).then(newAccount => {
                            commit('addAccount', newAccount);
                        });
                    },
                    onerror: e => {
                        console.error(e);
                    },
                });
        },
        initializeSingleAccount: async function (
            { dispatch, commit },
            { pkidAccount, seedPhrase, type }
        ) {
            commit('addAccountThombstone', pkidAccount.walletName);
            const index = pkidAccount.index ? pkidAccount.index : 0;
            if (!pkidAccount.stellar) {
                try {
                    await convertTfAccount(seedPhrase, 1, index);
                } catch (error) {
                    console.log("couldn't convert account");
                }
            }
            const account = await fetchAccount({
                index: index,
                name: pkidAccount.walletName,
                tags: [type],
                seedPhrase,
                position: pkidAccount.position,
            });
            commit('removeAccountThombstone', pkidAccount.walletName);
            dispatch('fetchPayments', account.id);

            commit('addAccount', account);

            dispatch('initializeTransactionWatcher', account);
            dispatch('initializeAccountWatcher', account);
        },
        initializePkidAppAccounts: async ({ dispatch, commit }, seedPhrase) => {
            const pkidAccounts = await dispatch('getPkidAppAccounts');
            const type = 'app';
            return pkidAccounts.map(pkidAccount => {
                pkidAccount.position = pkidAccount.position
                    ? pkidAccount.position
                    : pkidAccount.index;
                commit('incrementPosition');
                return dispatch('initializeSingleAccount', {
                    pkidAccount,
                    seedPhrase,
                    type,
                });
            });
        },
        initializeImportedPkidAccounts: async ({
            dispatch,
            commit,
            getters,
        }) => {
            const pkidImportedAccounts = await dispatch(
                'getPkidImportedAccounts'
            );
            return pkidImportedAccounts.map(pkidImportedAccount => {
                const seedPhrase = entropyToMnemonic(pkidImportedAccount.seed);
                const type = 'imported';
                pkidImportedAccount.position = pkidImportedAccount.position
                    ? pkidImportedAccount.position
                    : getters.position;
                commit('incrementPosition');
                return dispatch('initializeSingleAccount', {
                    pkidAccount: pkidImportedAccount,
                    seedPhrase,
                    type,
                });
            });
        },
        initialize: async (
            { commit, dispatch, state },
            { seed, doubleName }
        ) => {
            commit('startAppLoading');
            state.initialized = true;
            await dispatch('setPkidClient', seed);
            commit('setThreebotName', doubleName);

            const seedPhrase = entropyToMnemonic(seed);
            commit('setAppSeedPhrase', seedPhrase);

            const op1 = await dispatch('initializePkidAppAccounts', seedPhrase);
            const op2 = await dispatch('initializeImportedPkidAccounts');
            try {
                await Promise.all([...op1, ...op2]);
            } catch (error) {
                console.error(error);
                router.push({
                    name: 'error screen',
                    params: {
                        reason: 'conversion mistake',
                        fix: 'close and reopen wallet',
                    },
                });
                return;
            }
            await dispatch('saveToPkid');

            commit('stopAppLoading');
            commit('stopLoadingWallets');
        },
    },
    mutations: {
        setThreebotName: (state, threeBotName) => {
            state.threeBotName = threeBotName;
        },
        setAppSeedPhrase: (state, seedPhrase) => {
            state.appSeedPhrase = seedPhrase;
        },
        startLoadingWallets: state => {
            state.isLoadingWallets = true;
        },
        stopLoadingWallets: state => {
            state.isLoadingWallets = false;
        },
        startAppLoading: state => {
            state.appLoadingStack++;
        },
        stopAppLoading: state => {
            state.appLoadingStack--;
        },
        startMigratingAccount: state => {
            state.isMigratingAccount = true;
        },
        stopMigratingAccount: state => {
            state.isMigratingAccount = false;
        },
        incrementPosition: state => {
            state.position++;
        },
    },
    getters: {
        threeBotName: state => state.threeBotName,
        appSeedPhrase: state => state.appSeedPhrase,
        isLoadingWallets: state => state.isLoadingWallets,
        isMigratingAccount: state => state.isMigratingAccount,
        position: state => state.position,
        initialized: state => state.initialized,
        fee: state => state.fee,
        isAppLoading: state => state.appLoadingStack > 0,
    },
};

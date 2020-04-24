import { fetchAccount, mapAccount } from '../../services/AccountService';
import { fetchPayments, mapPayment } from '../../services/PaymentService';
import { entropyToMnemonic } from 'bip39';
import {
    calculateWalletEntropyFromAccount,
    convertTfAccount,
    generateActivationCode,
    keypairFromAccount,
} from '@jimber/stellar-crypto';
import config from '../../../public/config';
import StellarSdk, { Server } from 'stellar-sdk';
import router from '../../router';
import Accounts from './Accounts';

export default {
    state: {
        threeBotName: null,
        appSeedPhrase: null,
        isLoadingWallets: true,
        isMigratingAccount: false,
        position: 0,
        initialized: false,
        fee: StellarSdk.BASE_FEE,
        currencies: config.currencies,
        appLoadingStack: 0,
        loadingTitle: null,
        loadingSubTitle: null,
        accountEventStreams: null,
    },
    actions: {
        async updateAccount({ getters, commit }, accountId) {
            const server = new Server(config.stellarServerUrl);
            const message = await server
                .accounts()
                .accountId(accountId)
                .cursor('now')
                .call();

            const newAccount = await mapAccount({
                ...getters.accounts.find(a => a.id === accountId),
                accountResponse: message,
                // seed: Buffer.from(mnemonicToEntropy(account.seedPhrase), 'hex'),
            });
            commit('addAccount', newAccount);
        },
        async initializeTransactionWatcher({ commit, dispatch }, account) {
            const server = new Server(config.stellarServerUrl);
            server
                .payments()
                .forAccount(account.id)
                .cursor('now')
                .stream({
                    reconnectTimeout: 60000,
                    onmessage: message => {
                        if (message.to === config.tftFundAccount) {
                            return;
                        }

                        const payment = mapPayment({
                            ...message,
                            account_id: account.id,
                            rawPayment: message,
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
        disableAccountEventStreams({ commit, getters }) {
            const eventStreams = getters.accountEventStreams;
            commit('setAccountEventStreams', null);
            try {
                if (!eventStreams) {
                    return;
                }
                eventStreams.forEach(close => close());
            } catch (e) {
                console.error(e);
            }
        },
        async initializeAccountEventStreams(
            { dispatch, commit, getters },
            accounts
        ) {
            dispatch('disableAccountEventStreams');
            const server = new Server(config.stellarServerUrl);

            const accountEventStreams = accounts.map(account =>
                server
                    .accounts()
                    .accountId(account.id)
                    .cursor('now')
                    .stream({
                        onmessage: message => {
                            dispatch('fetchPayments', account.id);
                            mapAccount({
                                ...getters.accounts.find(
                                    a => a.id === account.id
                                ),
                                accountResponse: message,
                                // seed: Buffer.from(mnemonicToEntropy(account.seedPhrase), 'hex'),
                            }).then(newAccount => {
                                dispatch('fetchPayments', account.id);
                                commit('addAccount', newAccount);
                            });
                        },
                        onerror: e => {
                            console.error(e);
                        },
                    })
            );

            commit('setAccountEventStreams', accountEventStreams);
        },
        async initializeAccountWatcher({ commit, getters }, account) {
            const server = new Server(config.stellarServerUrl);
            server
                .accounts()
                .accountId(account.id)
                .cursor('now')
                .stream({
                    reconnectTimeout: 60000,
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
        async initializeSingleAccount(
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
            // dispatch('fetchPayments', account.id);

            commit('addAccount', account);

            if (config.watchersEnabled) {
                dispatch('initializeAccountWatcher', account);
                dispatch('initializeTransactionWatcher', account);
            }
        },
        async initializePkidAppAccounts({ dispatch, commit }, seedPhrase) {
            const pkidAccounts = await dispatch('fetchPkidAppAccounts');
            const type = 'app';

            if (!pkidAccounts) {
                return;
            }

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
        async initializeImportedPkidAccounts({ dispatch, commit, getters }) {
            const pkidImportedAccounts = await dispatch(
                'fetchPkidImportedAccounts'
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
        async generateInitialAccount({}, seedPhrase) {
            const entropy = calculateWalletEntropyFromAccount(seedPhrase, 0);
            const keyPair = keypairFromAccount(entropy);
            return await generateActivationCode(keyPair);
        },
        async initialize(
            { commit, dispatch, state, getters },
            { seed, doubleName }
        ) {
            commit('startAppLoading');
            commit('setLoadingMessage', { message: 'Initializing wallet' });
            state.initialized = true;
            await dispatch('setPkidClient', seed);
            commit('setThreebotName', doubleName);

            const seedPhrase = entropyToMnemonic(seed);
            commit('setAppSeedPhrase', seedPhrase);

            let op1 = await dispatch('initializePkidAppAccounts', seedPhrase);

            if (!op1) {
                try {
                    await fetchAccount({
                        seedPhrase,
                        index: 0,
                        name: 'Daily',
                        tags: ['app'],
                        position: 0,
                        retry: 0,
                    });
                    await dispatch('persistPkidAppAccounts', [
                        {
                            walletName: 'Daily',
                            position: 0,
                            index: 0,
                        },
                    ]);
                    await dispatch('persistPkidImportedAccounts', []);

                    op1 = await dispatch(
                        'initializePkidAppAccounts',
                        seedPhrase
                    );
                } catch (e) {
                    dispatch('generateInitialAccount', seedPhrase).then(
                        response => {
                            router.push({
                                name: 'sms',
                                params: {
                                    tel: response.phonenumbers[0],
                                    code: response.activation_code,
                                    address: response.address,
                                },
                            });
                        }
                    );
                    return;
                }
            }

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
            dispatch('initializeAccountEventStreams', getters.accounts);
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
            if (state.appLoadingStack <= 0) {
                state.loadingTitle = null;
                state.loadingSubTitle = null;
            }
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
        setLoadingMessage(state, { message, additional }) {
            state.loadingTitle = message;
            state.loadingSubTitle = additional;
        },
        setAccountEventStreams: (state, accountEventStreams) => {
            state.accountEventStreams = accountEventStreams;
        },
    },
    getters: {
        loadingSubTitle: state => state.loadingSubTitle,
        loadingTitle: state => state.loadingTitle,
        threeBotName: state => state.threeBotName,
        appSeedPhrase: state => state.appSeedPhrase,
        isLoadingWallets: state => state.isLoadingWallets,
        isMigratingAccount: state => state.isMigratingAccount,
        position: state => state.position,
        initialized: state => state.initialized,
        fee: state => state.fee,
        currencies: state => Object.keys(state.currencies),
        isAppLoading: state => state.appLoadingStack > 0,
        accountEventStreams: state => state.accountEventStreams,
    },
};

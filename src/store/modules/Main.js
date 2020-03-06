import { fetchAccount } from '../../services/AccountService';
import { entropyToMnemonic } from 'bip39';
import { convertTfAccount } from '@jimber/stellar-crypto';
import StellarSdk from 'stellar-sdk';
import axios from 'axios';

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
    initializeSingleAccount: async function(
      { dispatch, commit },
      { pkidAccount, seedPhrase, type }
    ) {
      commit('addAccountThombstone', pkidAccount.walletName);
      const index = pkidAccount.index ? pkidAccount.index : 0;
      if (!pkidAccount.stellar) {
        try {
          await convertTfAccount(seedPhrase, 1, index);
        } catch (error) {
          axios.get()

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
    initializeImportedPkidAccounts: async ({ dispatch, commit, getters }) => {
      const pkidImportedAccounts = await dispatch('getPkidImportedAccounts');
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
    initialize: async ({ commit, dispatch, state }, { seed, doubleName }) => {
      commit('startAppLoading');
      state.initialized = true;
      await dispatch('setPkidClient', seed);
      commit('setThreebotName', doubleName);

      const seedPhrase = entropyToMnemonic(seed);
      commit('setAppSeedPhrase', seedPhrase);

      const op1 = await dispatch('initializePkidAppAccounts', seedPhrase);
      const op2 = await dispatch('initializeImportedPkidAccounts');
      await Promise.all([...op1, ...op2]);
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

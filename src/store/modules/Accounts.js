import { mapGetters } from 'vuex';
import { fetchAccount } from '../../services/AccountService';

export default {
  state: {
    accounts: [],
  },
  computed: {
    ...mapGetters(['appSeedPhrase']),
  },
  actions: {
    generateAppAccount: async (context, walletName) => {
      const nextAppAcountIndex = context.getters.nextAppAcountIndex;
      const seedPhrase = context.getters.appSeedPhrase;
      const position = context.state.accounts.length;
      const account = await fetchAccount({
        index: nextAppAcountIndex,
        name: walletName,
        tags: ['app'],
        seedPhrase,
        position: position,
      });
      context.commit('addAccount', account);
    },
    generateImportedAccount: async (context, { seedPhrase, walletName }) => {
      const position = context.state.accounts.length;
      const account = await fetchAccount({
        index: 0,
        name: walletName,
        tags: ['imported'],
        seedPhrase,
        position: position,
      });
      context.commit('addAccount', account);
    },
    syncAccounts: async ({ commit, getters, dispatch }) => {
      commit('startAppLoading');
      const op1 = await dispatch(
        'initializePkidAppAccounts',
        getters.appSeedPhrase
      );
      console.log({ op1 });

      const op2 = await dispatch('initializeImportedPkidAccounts');
      await Promise.all([...op1, ...op2]);
      await dispatch('saveToPkid');
      console.log('aftersave');
      commit('stopAppLoading');
    },
  },
  mutations: {
    addAccount: (state, account) => {
      const index = state.accounts.findIndex(a => a.id === account.id);

      if (index === -1) {
        state.accounts.push(account);
        return;
      }
      state.accounts[index] = account;
    },
    removeAccount: (state, account) => {
      state.accounts = state.accounts.filter(item => item !== account);
    },
    setAccounts: (state, accounts) => {
      state.accounts = accounts;
    },
  },
  getters: {
    accounts: state => state.accounts,
    nextAppAcountIndex: state =>
      // @Reminder if deleted accounts are not in the account array,
      // this will not be correct
      state.accounts.filter(account => account.tags.includes('app')).length,
  },
};

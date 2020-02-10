import { mapGetters } from "vuex";
import { fetchAccount } from "../../services/AccountService";

export default {
  state: {
    accounts: []
  },
  computed: {
    ...mapGetters([
      "appSeedPhrase"
    ]),
    
  },
  actions: {
    generateAppAccount: async (context, walletName) => {
      const nextAppAcountIndex = context.getters.nextAppAcountIndex
      const seedPhrase = context.getters.appSeedPhrase
      const position = context.state.accounts.length
      const account = await fetchAccount({
        index: nextAppAcountIndex,
        name: walletName,
        tags: ["app"],
        seed: seedPhrase,
        position: position
      });
      console.log(account)
      context.commit("addAccount", account);
    }},
  mutations: {
    addAccount: (state, account) => {
      state.accounts = [...state.accounts, account];
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
      state.accounts.filter( account => 
        account.tags.includes("app")
      ).length
  }
};

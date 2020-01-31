export default {
  state: {
    accounts: []
  },
  actions: {
    createAccount: context => {
      // @todo: generate account
      const account = {
        seed: "",
        tags: ["app"]
      };
      context.commit("addAccount", account);
    }
  },
  mutations: {
    addAccount: (state, account) => {
      state.accounts = [...state.accounts, account];
    },
    removeAccount: (state, account) => {
      state.accounts = state.accounts.filter(item => item !== account);
    }
  },
  getters: {
    accounts: state => state.accounts
  }
};

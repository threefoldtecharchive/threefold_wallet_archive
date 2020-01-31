export default {
  state: {
    wallets: []
  },
  actions: {
    createWallet: context => {
      // @todo: generate account
      const wallet = {
        name: "",
        account: "",
        transactions: []
      };
      context.commit("addWallet", wallet);
    }
  },
  mutations: {
    addWallet: (state, wallet) => {
      state.wallets = [...state.wallets, wallet];
    },
    removeWallet: (state, wallet) => {
      state.wallets = state.wallets.filter(item => item !== wallet);
    }
  },
  getters: {
    wallets: state => state.wallets
  }
};

import { generateAccount } from "../../services/stellarService";

export default {
  state: {
    accounts: []
  },
  actions: {
    createAccount: async (context, obj) => {
      const accountResponse = await generateAccount(obj.seed, obj.index);
      console.log(accountResponse);

      let account = {
        name: obj.name,
        tags: [obj.type],
        id: accountResponse.id,
        balances: accountResponse.balances,
        transactions: await accountResponse.transactions(),
        index: obj.index
      };
      console.log(account);
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

import { generateAccount } from "../../services/stellarService";

export default {
  state: {
    threeBotName: null,
    accounts: []
  },
  actions: {
    createAccount: async (context, obj) => {
      const accountResponse = await generateAccount(obj.seed, obj.index);

      let account = {
        name: obj.name,
        tags: [obj.type],
        id: accountResponse.id,
        balances: accountResponse.balances,
        transactions: await accountResponse.transactions(),
        index: obj.index
      };
      // @TODO make this dynamic in login
      context.commit("setThreebotName", "tobias.3bot")
      context.commit("addAccount", account);
    }
  },
  mutations: {
    setThreebotName: (state, threeBotName) => {
      state.threeBotName = threeBotName
    },
    addAccount: (state, account) => {
      state.accounts = [...state.accounts, account];
    },
    removeAccount: (state, account) => {
      state.accounts = state.accounts.filter(item => item !== account);
    }
  },
  getters: {
    threeBotName: state => state.threeBotName,
    accounts: state => state.accounts
  }
};

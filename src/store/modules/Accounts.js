import { generateAccount } from "../../services/stellarService";
import { mapAccount } from "../../services/AccountService";

export default {
  state: {
    accounts: []
  },
  actions: {
    createAccount: async (context, obj) => {
      const accountResponse = await generateAccount(obj.seed, obj.index);

      let account = await mapAccount({
        accountResponse: accountResponse,
        name: obj,
        tags: ["app"],
        index: obj.index
      });
      console.log(account);
      // @TODO make this dynamic in login
      context.commit("setThreebotName", "tobias.3bot");
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

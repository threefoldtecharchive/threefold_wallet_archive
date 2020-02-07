import { generateAccount } from "../../services/stellarService";
import { mapAccount } from "../../services/AccountService";

export default {
  state: {
    accounts: []
  },
  actions: {
    createAccount: async (context, { seed, name, index }) => {
      const accountResponse = await generateAccount(seed, index);

      let account = await mapAccount({
        accountResponse: accountResponse,
        name: name,
        tags: ["app"],
        index: index
      });
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

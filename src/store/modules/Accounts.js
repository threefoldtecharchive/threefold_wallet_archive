import { generateAccount } from "../../services/stellarService";
import { mapAccount } from "../../services/AccountService";

export default {
  state: {
    accounts: []
  },
  actions: {},
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

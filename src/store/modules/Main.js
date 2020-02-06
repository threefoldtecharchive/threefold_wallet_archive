import { fetchAccount } from "../../services/AccountService";
import { entropyToMnemonic } from "bip39";
import { convertTfAccount } from "@jimber/stellar-crypto";

export default {
  state: {
    threeBotName: null
  },
  actions: {
    initializePkidAppAccounts: async (context, seed) => {
      const pkidAccounts = await context.dispatch("getPkidAppAccounts");

      const seedPhrase = entropyToMnemonic(seed);
      for (const pkidAccount of pkidAccounts) {
        const account = await fetchAccount({
          index: pkidAccount.index,
          name: pkidAccount.walletName,
          tags: ["app"],
          seed: seedPhrase
        });
        context.commit("addAccount", account);
      }
    },
    initialize: async (context, params) => {
      console.log("initialize");
      await convertTfAccount(entropyToMnemonic(params.seed), 4, 0);
      await context.dispatch("setPkidClient", params.seed);
      context.commit("setThreebotName", params.doubleName);

      await context.dispatch("initializePkidAppAccounts", params.seed);
      console.log(context.getters.accounts);
      // await context.dispatch("initializeImportedPkidAccounts");
    }
  },
  mutations: {
    setThreebotName: (state, threeBotName) => {
      state.threeBotName = threeBotName;
    }
  },
  getters: {
    threeBotName: state => state.threeBotName
  }
};

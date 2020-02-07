import { fetchAccount } from "../../services/AccountService";
import { entropyToMnemonic } from "bip39";
import { convertTfAccount } from "@jimber/stellar-crypto";

export default {
  state: {
    threeBotName: null,
    isLoadingWallets: true,
    isMigratingAccount: false
  },
  actions: {
    initialiseSingleAppAccount: async function(
      context,
      { pkidAccount, seed, seedPhrase }
    ) {
      if (!pkidAccount.stellar) {
        await convertTfAccount(entropyToMnemonic(seed), 1, pkidAccount.index);
      }
      const account = await fetchAccount({
        index: pkidAccount.index,
        name: pkidAccount.walletName,
        tags: ["app"],
        seed: seedPhrase,
        position: pkidAccount.position
          ? pkidAccount.position
          : pkidAccount.index
      });
      context.commit("addAccount", account);
    },
    initializePkidAppAccounts: async (context, seed) => {
      const pkidAccounts = await context.dispatch("getPkidAppAccounts");

      const seedPhrase = entropyToMnemonic(seed);

      await Promise.all(
        pkidAccounts.map(pkidAccount =>
          context.dispatch("initialiseSingleAppAccount", {
            pkidAccount,
            seed,
            seedPhrase
          })
        )
      );
    },
    initialize: async (context, params) => {
      console.log("initialize");
      await context.dispatch("setPkidClient", params.seed);
      context.commit("setThreebotName", params.doubleName);

      await context.dispatch("initializePkidAppAccounts", params.seed);
      console.log(context.getters.accounts);
      // await context.dispatch("initializeImportedPkidAccounts");
      await context.commit("stopLoadingWallets");
    }
  },
  mutations: {
    setThreebotName: (state, threeBotName) => {
      state.threeBotName = threeBotName;
    },
    stopLoadingWallets: state => {
      state.isLoadingWallets = false;
    },
    startMigratingAccount: state => {
      state.isMigratingAccount = true;
    },
    stopMigratingAccount: state => {
      state.isMigratingAccount = false;
    }
  },
  getters: {
    threeBotName: state => state.threeBotName,
    isLoadingWallets: state => state.isLoadingWallets,
    isMigratingAccount: state => state.isMigratingAccount
  }
};

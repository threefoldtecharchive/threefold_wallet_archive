import { fetchAccount } from "../../services/AccountService";
import { entropyToMnemonic } from "bip39";
import { convertTfAccount } from "@jimber/stellar-crypto";

export default {
  state: {
    threeBotName: null,
    appSeedPhrase: null,
    isLoadingWallets: true,
    isMigratingAccount: false,
    position: 0,
    initialized: false
  },
  actions: {
    initializeSingleAccount: async function(
      context,
      { pkidAccount, seedPhrase, type }
    ) {
      const index = pkidAccount.index ? pkidAccount.index : 0;
      if (!pkidAccount.stellar) {

        await convertTfAccount(seedPhrase, 1, index);
      }
      const account = await fetchAccount({
        index: index,
        name: pkidAccount.walletName,
        tags: [type],
        seedPhrase,
        position: pkidAccount.position
      });
      context.commit("addAccount", account);
    },
    initializePkidAppAccounts: async (context, seedPhrase) => {
      const pkidAccounts = await context.dispatch("getPkidAppAccounts");
      const type = "app";
      return pkidAccounts.map(pkidAccount => {
        pkidAccount.position = pkidAccount.position
          ? pkidAccount.position
          : pkidAccount.index;
        context.commit("incrementPosition");
        context.dispatch("initializeSingleAccount", {
          pkidAccount,
          seedPhrase,
          type
        });
      });
    },
    initializeImportedPkidAccounts: async context => {
      const pkidImportedAccounts = await context.dispatch(
        "getPkidImportedAccounts"
      );
      return pkidImportedAccounts.map(pkidImportedAccount => {
        const seedPhrase = entropyToMnemonic(pkidImportedAccount.seed);
        const type = "imported";
        pkidImportedAccount.position = pkidImportedAccount.position
          ? pkidImportedAccount.position
          : context.getters.position;
        context.commit("incrementPosition");
        return context.dispatch("initializeSingleAccount", {
          pkidAccount: pkidImportedAccount,
          seedPhrase,
          type
        });
      });
    },
    initialize: async (context, {seed,doubleName}) => {
      context.state.initialized = true;
      await context.dispatch("setPkidClient", seed)
      context.commit("setThreebotName", doubleName)

      const seedPhrase = entropyToMnemonic(seed)
      console.log("settingapp seed", seedPhrase)
      context.commit("setAppSeedPhrase", seedPhrase)

      const op1 = await context.dispatch(
        "initializePkidAppAccounts",
        seedPhrase
      );
      const op2 = await context.dispatch("initializeImportedPkidAccounts");
      await Promise.all([...op1, ...op2]);
      await context.dispatch('saveToPkid');
      context.commit("stopLoadingWallets");
    }
  },
  mutations: {
    setThreebotName: (state, threeBotName) => {
      state.threeBotName = threeBotName;
    },
    setAppSeedPhrase: (state, seedPhrase) => {
      state.appSeedPhrase = seedPhrase
    },
    stopLoadingWallets: state => {
      state.isLoadingWallets = false;
    },
    startMigratingAccount: state => {
      state.isMigratingAccount = true;
    },
    stopMigratingAccount: state => {
      state.isMigratingAccount = false;
    },
    incrementPosition: state => {
      state.position++;
    }
  },
  getters: {
    threeBotName: state => state.threeBotName,
    appSeedPhrase: state => state.appSeedPhrase,
    isLoadingWallets: state => state.isLoadingWallets,
    isMigratingAccount: state => state.isMigratingAccount,
    position: state => state.position,
    initialized: state => state.initialized
  }
};

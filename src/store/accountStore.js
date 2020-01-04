import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
import nbhService from '../services/nbhService'
export default {
  state: {
    syncing: false,
    accounts: null,
    intervalIsSet: false,
    doubleName: false
  },
  actions: {
    login (context, userData) {
      context.commit('setDoubleName', userData.doubleName);

      var tfAccount = new tfchain.Account(
        `tft:${userData.doubleName}`,
        userData.doubleName,
        {
          seed: userData.seed,
          network: config.tftNetwork
        }
      );

      tfAccount.type = 'app';
      context.commit('setAccounts', [tfAccount]);
      context.dispatch('updateAccounts');
      context.dispatch('createWallet', {
        chain: 'tft',
        walletName: 'daily',
        id: '0'
      });
      context.dispatch('createWallet', {
        chain: 'tft',
        walletName: 'savings',
        id: '0'
      });

      // Get wallet list with names and create them all.

      let appWallets = JSON.parse(localStorage.getItem('appWallets'));
      if (appWallets != null && appWallets) {
        for (let appWallet of appWallets.filter(
          x => x.doubleName === userData.doubleName
        )) {
          appWallet.id = 0;
          context.dispatch('createWallet', appWallet);
        }
      } else if (appWallets == null) {
        // Loop 20 wallets and check balance
        context.commit('setImportingWallets', true);
        for (let index = 3; index <= 20; index++) {
          const appWallet = {
            chain: 'tft',
            id: '0',
            walletName: `Wallet${index}`,
            doubleName: userData.doubleName
          };
          context.dispatch('createWallet', appWallet);
        }
        context.dispatch('updateAccounts', () => {
          setTimeout(() => {
            for (
              let index = context.getters.wallets.length - 1;
              index > 1;
              index--
            ) {
              const wallet = context.getters.wallets[index];
              if (!wallet.transaction || !wallet.transaction.length) {
                context.getters.accounts.forEach(account => {
                  account.wallet_delete(index, wallet.name);
                });
              } else {
                for (
                  let existingWalletIndex = 0;
                  existingWalletIndex < index.length;
                  existingWalletIndex++
                ) {
                  const newWallet = index[existingWalletIndex];
                  var postMsg = {
                    type: 'ADD_APP_WALLET',
                    walletName: newWallet.name,
                    doubleName: userData.doubleName
                  };

                  // Print.postMessage(JSON.stringify(postMsg))
                }
                context.commit('setImportingWallets', false);
                return;
              }
            }

            var pstMsg = {
              type: 'ADD_APP_WALLET'
            };

            // Print.postMessage(JSON.stringify(pstMsg))
            context.commit('setImportingWallets', false);
          }, 3000);
        });
      }
    },
    updateAccounts(context, callBack) {
      context.getters.accounts.forEach(function(account) {
        if (callBack) {
          callBack();
        }
        if (account && !context.getters.syncing) {
          context.commit('setSync', true);
          account.update_account(function() {
            context.commit('setSync', false);
          });
        }
      });

      if (!context.getters.intervalIsSet) {
        context.commit('setIntervalIsSet', true);
        setInterval(() => {
          context.dispatch('updateAccounts');
        }, 60000);
      }
    },
    createWallet: (context, data) => {
      var account = context.getters.accounts[data.id];
      if (account) {
        account.wallet_new(data.walletName, account.wallet_count, 1);
      }
    },
    importWallet: (context, data) => {
      var tfAccount2 = new tfchain.Account(
        `tft:${data.doubleName}`,
        data.doubleName,
        {
          seed: data.seed,
          network: config.tftNetwork
        }
      );

      tfAccount2.type = 'imported';

      var accounts = context.getters.accounts;

      accounts.push(tfAccount2);
      context.commit('setAccounts', accounts);

      context.dispatch('updateAccounts');
      context.dispatch('createWallet', {
        chain: 'tft',
        walletName: data.walletName,
        id: accounts.length - 1
      });
    }
  },
  mutations: {
    setIntervalIsSet: (state, bool) => {
      state.intervalIsSet = bool;
    },
    setDoubleName: (state, doubleName) => {
      state.doubleName = doubleName;
    },
    setSeed: (state, seed) => {
      state.seed = seed;
    },
    setSync: (state, syncing) => {
      state.syncing = syncing;
    },
    setAccounts: (state, accounts) => {
      state.accounts = accounts;
    },
    updateAddressBook: (state, transactions) => {},
    setLocked: (state, hasLocked) => {
      state.hasLocked = hasLocked;
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    accounts: state => state.accounts,
    wallets: state => {
      var wallets = [];
      if (state.accounts) {
        state.accounts.forEach(account => {
          var t = account.wallets.map(wallet => {
            var balance = wallet.balance;
            var unlocked = wallet.balance.coins_unlocked.str({ precision: 3 });
            var locked = wallet.balance.coins_locked.greater_than(0)
              ? wallet.balance.coins_locked.str({ precision: 3 })
              : null;
            if (!window.completeWallet) {
              window.completeWallet = wallet;
            }
            // console.log(`complete wallet`,wallet)
            return {
              name: wallet.wallet_name,
              address: wallet.address,
              totalAmount: unlocked,
              totalLocked: locked,
              transaction: balance.transactions,
              holder: account,
              currency: wallet.balance._chain_type.currency_unit(),
              isAuthenticated: nbhService
                .getWalletAuthStatus(wallet.address)
                .then(status => {
                  if (status) return status.data.auths[0];
                  return false;
                })
            };
          });
          wallets.push(...t);
        });
        return wallets;
      }
    },
    syncing: state => state.syncing,
    intervalIsSet: state => state.intervalIsSet,
    hasLocked: state => {
      var wallets = [];
      var hasLockedTokens = false;
      if (state.accounts) {
        state.accounts.forEach(account => {
          account.wallets.forEach(wallet => {
            if (wallet.balance.coins_locked && wallet.balance.coins_locked.greater_than(0)) {
              hasLockedTokens = true
            }
          });
        });
      }
      return hasLockedTokens
    }
  }
};

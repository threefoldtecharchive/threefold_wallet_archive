import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
import nbhService from '../services/nbhService'
import router from '../router'

export default {
  state: {
    syncing: false,
    accounts: null,
    intervalIsSet: false,
    doubleName: false
  },
  actions: {
    async login (context, userData) {
      context.commit('setDoubleName', userData.doubleName)

      var tfAccount = new tfchain.Account(
        `tft:${userData.doubleName}`,
        userData.doubleName,
        {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )
      tfAccount.type = 'app'

      context.commit('setImportingWallets', true)

      window.account = tfAccount

      //  daily and savings are always generated
      await tfAccount.wallet_new(`daily`, tfAccount.wallet_count, 1)
      await tfAccount.wallet_new(`savings`, tfAccount.wallet_count, 1)
      await tfAccount.update_account()
      
      await context.dispatch('loadAppWallets', tfAccount)
      console.log('finished loading appwallets')
      context.commit('setAccounts', [tfAccount])
      
      await context.dispatch('loadImportedWallets')

      context.commit('setImportingWallets', false)
      router.push({ name: 'home' })
    },
    async loadAppWallets (context, account) {
      const appWallets = JSON.parse(localStorage.getItem('appWallets'))

      if (appWallets != null && appWallets) {
        console.log('Wallets are passed by the app')
        context.dispatch('restoreWallets', appWallets)
      } else {
        await context.dispatch('recoverWallets', account)
      }
    },
    restoreWallets (context, appWallets) {
      console.log("todo fix restoreWallets")
      // Todo fix restore
      // for (const appWallet of appWallets.filter(
      //   x => x.doubleName === userData.doubleName
      // )) {
      //   appWallet.id = 0
      //   context.dispatch('createWallet', appWallet)
      // }
    },
    async recoverWallets (context, account) {
      await context.dispatch('createFirstWallets', account)
      console.log("after createFirstWallets")
      await account.update_account()
      console.log("after update account")

      context.dispatch('removeWalletsUntillTransaction', account)
    },
    async createFirstWallets (context, account) {
      console.log("createFirstWallets")
      //  create first 20 wallets
      window.account = account
      for (let index = 3; index <= 20; index++) {
        console.log('walletcount', account.wallet_count)
        await account.wallet_new(`Wallet${index}`, account.wallet_count, 1, false)
        console.log(`account ${index} created`)
      }
    },
    removeWalletsUntillTransaction (context, account) {
      console.log("removeWalletsUntillTransaction")
      //  Take wallets from acccount and remove them from the last till first untill a transaction is found
      const wallets = account.wallets
      for (let index = wallets.length - 1; index > 1; index--) {
        var wallet = wallets[index]
        if (!wallet.balance || !wallet.balance.transactions || !wallet.balance.transactions.length) {
          console.log(wallet.wallet_name, 'has no transactions')
          account.wallet_delete(index, wallet.wallet_name)
        } else {
          context.dispatch('saveExistingWalletsToApp', {
            wallets: wallets,
            index: index
          })
          return
        }
      }
    },
    saveExistingWalletsToApp (context, data) {
      const wallets = data.wallets
      let index = data.index
      console.log("saveExistingWalletsToApp")
      console.log(`wallets length `,wallets.length)
      console.log(`index `,index)

      for (index; index > 1; index--) {
        console.log("insavetoapp")
        const newWallet = wallets[index]
        var postMsg = {
          type: 'ADD_APP_WALLET',
          walletName: newWallet.wallet_name,
          doubleName: context.getters.doubleName
        }
        console.log(`saving wallet to device`,postMsg)
        // @todo  put this out of comments
        // window.flutter_inappwebview.callHandler('ADD_APP_WALLET', postMsg).then(function (result) {
        //   console.log("saved wallet to app")
        // })
      }
    },
    async loadImportedWallets () {
      const importedWallets = JSON.parse(
        localStorage.getItem('importedWallets')
      )
      console.log('importedWallets from localstorage', importedWallets)
      if (importedWallets != null && importedWallets) {
        for (const user of importedWallets.filter(
          x => x.doubleName === userData.doubleName
        )) {
          console.log('loop importedwallets', user)
          user.seed = new Uint8Array(user.seed)
          await context.dispatch('importWallet', user)
        }
      }
    },
    updateAccounts (context, callBack) {
      context.getters.accounts.forEach(function (account) {
        if (callBack) {
          callBack()
        }
        if (account && !context.getters.syncing) {
          context.commit('setSync', true)
          account.update_account(function () {
            context.commit('setSync', false)
          })
        }
      })

      if (!context.getters.intervalIsSet) {
        context.commit('setIntervalIsSet', true)
        setInterval(() => {
          context.dispatch('updateAccounts')
        }, 60000)
      }
    },
    createWallet: (context, data) => {
      var account = context.getters.accounts[data.id]
      if (account) {
        account.wallet_new(data.walletName, account.wallet_count, 1)
      }
    },
    importWallet: async (context, data) => {
      console.log('Import Wallet', data)
      var tfAccount2 = new tfchain.Account(
        `tft:${data.doubleName}`,
        data.doubleName,
        {
          seed: data.seed,
          network: config.tftNetwork
        }
      )
      tfAccount2.wallet_new(data.walletName, 0, 1)

      tfAccount2.type = 'imported'
      await tfAccount2.update_account()

      var accounts = context.getters.accounts

      accounts.push(tfAccount2)
      context.commit('setAccounts', accounts)

      context.dispatch('updateAccounts')
    }
  },
  mutations: {
    setIntervalIsSet: (state, bool) => {
      state.intervalIsSet = bool
    },
    setDoubleName: (state, doubleName) => {
      state.doubleName = doubleName
    },
    setSeed: (state, seed) => {
      state.seed = seed
    },
    setSync: (state, syncing) => {
      state.syncing = syncing
    },
    setAccounts: (state, accounts) => {
      state.accounts = accounts
    },
    updateAddressBook: (state, transactions) => {},
    setLocked: (state, hasLocked) => {
      state.hasLocked = hasLocked
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    accounts: state => state.accounts,
    wallets: state => {
      var wallets = []
      if (state.accounts) {
        state.accounts.forEach(account => {
          var t = account.wallets.map(wallet => {
            var balance = wallet.balance
            var unlocked = wallet.balance.coins_unlocked.str({ precision: 3 })
            var locked = wallet.balance.coins_locked.greater_than(0)
              ? wallet.balance.coins_locked.str({ precision: 3 })
              : null
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
                  if (status) return status.data.auths[0]
                  return false
                })
            }
          })
          wallets.push(...t)
        })
        return wallets
      }
    },
    syncing: state => state.syncing,
    intervalIsSet: state => state.intervalIsSet,
    hasLocked: state => {
      console.log("calculating haslocked")
      var wallets = []
      var hasLockedTokens = false
      if (state.accounts) {
        state.accounts.forEach(account => {
        //   console.log(account)
          account.wallets.forEach(wallet => {
            if (wallet.balance.coins_locked && wallet.balance.coins_locked.greater_than(0)) {
              // console.log("haslocked")
              hasLockedTokens = true
            }
          })
        })
      }
      return hasLockedTokens
    }
  }
}

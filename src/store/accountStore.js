import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
import nbhService from '../services/nbhService'
import router from '../router'

export default {
  state: {
    syncing: false,
    accounts: null,
    intervalIsSet: false,
    doubleName: false,
    wallets: []
  },
  actions: {
    async login (context, userData) {

      await context.dispatch('setPkidClient', userData.seed)
      window.localStorage.setItem('importedWallets', await context.dispatch('getPkidWallets'))

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

      //  daily and savings are always generated
      await tfAccount.wallet_new(`daily`, tfAccount.wallet_count, 1)
      await tfAccount.wallet_new(`savings`, tfAccount.wallet_count, 1)
      await tfAccount.update_account()

      await context.dispatch('loadAppWallets', tfAccount)
      context.commit('setAccounts', [tfAccount])

      await context.dispatch('loadImportedWallets')

      await context.dispatch('updateAccounts')

      await context.dispatch('updatePkidWallets')

      context.commit('setImportingWallets', false)
    },
    async loadAppWallets (context, account) {
      const appWallets = JSON.parse(localStorage.getItem('appWallets'))

      if (appWallets != null && appWallets) {
        context.dispatch('restoreWallets', { appWallets: appWallets, account: account })
      } else {
        await context.dispatch('recoverWallets', account)
      }
      await account.update_account()
    },
    async restoreWallets (context, data) {
      const appWallets = data.appWallets
      const account = data.account
      const doubleName = context.getters.doubleName
      for (const appWallet of appWallets.filter(
        x => x.doubleName === doubleName
      )) {
        await account.wallet_new(appWallet.walletName, account.wallet_count, 1)
      }
    },
    async recoverWallets (context, account) {
      await context.dispatch('createFirstWallets', account)
      await account.update_account()

      context.dispatch('removeWalletsUntillTransaction', account)
    },
    async createFirstWallets (context, account) {
      //  create first 20 wallets
      for (let index = 3; index <= 20; index++) {
        await account.wallet_new(`Wallet${index}`, account.wallet_count, 1, false)
      }
    },
    removeWalletsUntillTransaction (context, account) {
      //  Take wallets from acccount and remove them from the last till first untill a transaction is found
      const wallets = account.wallets
      // @todo for to foreach (pkid)
      for (let index = wallets.length - 1; index > 1; index--) {
        var wallet = wallets[index]
        if (!(!wallet.balance || !wallet.balance.transactions || !wallet.balance.transactions.length)) {
          context.dispatch('saveExistingWalletsToApp', {
            wallets: wallets,
            index: index
          })
          return
        }
        account.wallet_delete(index, wallet.wallet_name)
      }
    },
    saveExistingWalletsToApp (context, data) {
      const wallets = data.wallets
      let index = data.index

      for (index; index > 1; index--) {
        const newWallet = wallets[index]
        var postMsg = {
          type: 'ADD_APP_WALLET',
          walletName: newWallet.wallet_name,
          doubleName: context.getters.doubleName
        }
        window.flutter_inappwebview.callHandler('ADD_APP_WALLET', postMsg).then(function (result) {
        })
      }
    },
    async loadImportedWallets (context) {
      const importedWallets = await context.dispatch('getPkidImportedAccounts')

      for (const wallet of importedWallets) {
        wallet.seed = new Uint8Array(wallet.seed)
        await context.dispatch('importWallet', wallet)
      }
    },
    async updateAccounts (context) {
      for (const account of context.getters.accounts) {
        await account.update_account()
      }

      let wallets = []
      context.getters.accounts.forEach(account => {
        const t = account.wallets.map(wallet => {
          const balance = wallet.balance
          const unlocked = wallet.balance.coins_unlocked.str({ precision: 3 })
          const locked = wallet.balance.coins_locked.greater_than(0)
            ? wallet.balance.coins_locked.str({ precision: 3 })
            : null
          return {
            name: wallet.wallet_name,
            address: wallet.address,
            totalAmount: unlocked,
            totalLocked: locked,
            transaction: balance.transactions,
            holder: account,
            currency: wallet.balance._chain_type.currency_unit()
          }
        })
        wallets.push(...t)
      })
      context.commit('setWallets', wallets)
      context.dispatch('updatePkidWallets')

      if (!context.getters.intervalIsSet) {
        context.commit('setIntervalIsSet', true)
        setInterval(() => {
          context.dispatch('updateAccounts')
        }, 60000)
      }
    },
    createWallet: async (context, data) => {
      var account = context.getters.accounts[data.id]
      if (account) {
        await account.wallet_new(data.walletName, account.wallet_count, 1)
      }
    },
    importWallet: async (context, data) => {
      let tfAccount2 = new tfchain.Account(
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

      let accounts = context.getters.accounts

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
    },
    setWallets: (state, wallets) => {
      state.wallets = wallets
    }
  },
  getters: {
    doubleName: state => state.doubleName,
    accounts: state => state.accounts,
    wallets: state => state.wallets,
    syncing: state => state.syncing,
    intervalIsSet: state => state.intervalIsSet,
    hasLocked: state => {
      var wallets = []
      var hasLockedTokens = false
      if (state.accounts) {
        state.accounts.forEach(account => {
          account.wallets.forEach(wallet => {
            if (wallet.balance.coins_locked && wallet.balance.coins_locked.greater_than(0)) {
              hasLockedTokens = true
            }
          })
        })
      }
      return hasLockedTokens
    }
  }
}

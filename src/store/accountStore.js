import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'

export default {
  state: {
    syncing: false,
    accounts: null,
    intervalIsSet: false,
    doubleName: false,
    wallets: []
  },
  actions: {
    generateTfAccount: async function (context, userData) {
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

      const appWallets = await context.dispatch('getPkidWallets')

      if (appWallets === null) {
        context.dispatch('loadAppWallets', tfAccount)
        //  daily and savings are always generated
        await tfAccount.wallet_new('daily', tfAccount.wallet_count, 1)
        await tfAccount.wallet_new('savings', tfAccount.wallet_count, 1)
      }

      for (const wallet of appWallets || []) {
        await tfAccount.wallet_new(wallet.walletName, wallet.index, 1)
      }

      await tfAccount.update_account()
      context.commit('setAccounts', [tfAccount])
    },
    async login (context, userData) {
      try {
        await context.dispatch('setPkidClient', userData.seed)

        context.commit('setDoubleName', userData.doubleName)
        await context.dispatch('generateTfAccount', userData)
        await context.dispatch('loadImportedWallets')

        await context.dispatch('updateAccounts')
      } catch (error) {
        context.commit('setFatalError', 'The wallet is currently not available')
        context.commit('setImportingWallets', false)
        // have to throw error because else the default init flow will redirect to /login
        throw error
      }
      context.commit('setImportingWallets', false)
    },
    async loadAppWallets (context, account) {
      const appWallets = JSON.parse(window.localStorage.getItem('appWallets'))

      if (appWallets != null && appWallets) {
        context.dispatch('restoreWallets', {
          appWallets: appWallets,
          account: account
        })
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

      await context.dispatch('removeWalletsUntillTransaction', account)
    },
    async createFirstWallets (context, account) {
      //  create first 20 wallets
      for (let index = 3; index <= 20; index++) {
        await account.wallet_new(
          `Wallet${index}`,
          account.wallet_count,
          1,
          false
        )
      }
    },
    async removeWalletsUntillTransaction (context, account) {
      //  Take wallets from acccount and remove them from the last till first untill a transaction is found
      const wallets = account.wallets
      // @todo for to foreach (pkid)
      for (let index = wallets.length - 1; index > 1; index--) {
        var wallet = wallets[index]
        if (
          !(
            !wallet.balance ||
            !wallet.balance.transactions ||
            !wallet.balance.transactions.length
          )
        ) {
          await context.dispatch('saveExistingWalletsToApp', {
            wallets: wallets,
            index: index
          })
          return
        }
        account.wallet_delete(index, wallet.wallet_name)
      }
    },
    async saveExistingWalletsToApp (context, data) {
      const wallets = data.wallets
      let index = data.index

      for (index; index > 1; index--) {
        const newWallet = wallets[index]
        var postMsg = {
          walletName: newWallet.wallet_name,
          doubleName: context.getters.doubleName
        }

        postMsg = JSON.stringify(postMsg)
      }
    },
    async loadImportedWallets (context) {
      let importedWallets = await context.dispatch('getPkidImportedAccounts')

      if (importedWallets === null) {
        importedWallets = JSON.parse(
          window.localStorage.getItem('importedWallets')
        )
      }

      for (const wallet of importedWallets || []) {
        wallet.seed = new Uint8Array(wallet.seed)
        await context.dispatch('importWallet', wallet)
      }
    },
    async updateAccounts (context) {
      for (const account of context.getters.accounts) {
        await account.update_account()
      }

      const wallets = []
      context.getters.accounts.forEach(account => {
        const t = account.wallets.map(wallet => {
          const balance = wallet.balance
          const unlocked = wallet.balance.coins_unlocked.str({ precision: 3 })
          const locked = wallet.balance.coins_locked.greater_than(0)
            ? wallet.balance.coins_locked.str({ precision: 3 })
            : null
          const unconfirmed = wallet.balance.unconfirmed_coins_total
          return {
            name: wallet.wallet_name,
            address: wallet.address,
            totalAmount: unlocked,
            totalLocked: locked,
            unconfirmed: unconfirmed,
            transaction: balance.transactions,
            holder: account,
            currency: wallet.balance._chain_type.currency_unit(),
            walletIndex: wallet.wallet_index,
            startIndex: wallet.start_index
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
      context.dispatch('updateAccounts')
    },
    importWallet: async (context, data) => {
      const tfAccount2 = new tfchain.Account(
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

      const accounts = context.getters.accounts

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
    // eslint-disable-next-line no-unused-vars
    updateAddressBook: (state, transactions) => {},
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
    hasLockedOrUnconfirmed: state => {
      var hasLockedOrUnconfirmed = false
      if (state.accounts) {
        state.accounts.forEach(account => {
          account.wallets.forEach(wallet => {
            if (
              (wallet.balance.coins_locked &&
                wallet.balance.coins_locked.greater_than(0)) ||
              (wallet.balance.unconfirmed_coins_total &&
                wallet.balance.unconfirmed_coins_total.greater_than(0))
            ) {
              // console.log("haslocked")
              hasLockedOrUnconfirmed = true
            }
          })
        })
      }
      return hasLockedOrUnconfirmed
    }
  }
}

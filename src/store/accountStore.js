import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
import nbhService from '../services/nbhService'
export default ({
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
        userData.doubleName, {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )

      console.log(userData.seed)

      tfAccount.type = "app"

      context.commit('setAccounts', [tfAccount])

      context.dispatch('updateAccounts')

      context.dispatch('createWallet', { chain: 'tft', walletName: 'daily', id: '0' })
      context.dispatch('createWallet', { chain: 'tft', walletName: 'savings', id: '0' })
    },
    updateAccounts (context) {
      context.getters.accounts.forEach(account => {
        if (account && !context.getters.syncing) {
          context.commit('setSync', true)

          account.update_account(() => {
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
    importWallet: (context, data) => {
      var tfAccount2 = new tfchain.Account(
        `tft:${data.doubleName}`,
        data.doubleName, {
          seed: data.words,
          network: config.tftNetwork
        }
      )

      console.log(data.doubleName, data.walletName)

      tfAccount2.type = "imported"

      var accounts = context.getters.accounts;

      console.log(accounts)
      console.log(accounts.length)

      accounts.push(tfAccount2)

      console.log(accounts)
      console.log(accounts.length)

      context.commit('setAccounts', accounts)

      context.dispatch('updateAccounts')
      context.dispatch('createWallet', { chain: 'tft', walletName: data.walletName, id: accounts.length - 1 })
    }
  },
  mutations: {
    setIntervalIsSet: (state, bool) => { state.intervalIsSet = bool },
    setDoubleName: (state, doubleName) => { state.doubleName = doubleName },
    setSeed: (state, seed) => { state.seed = seed },
    setSync: (state, syncing) => { state.syncing = syncing },
    setAccounts: (state, accounts) => {
      state.accounts = accounts
    },
    updateAddressBook: (state, transactions) => {
    }
  },
  getters: {
    doubleName: (state) => state.doubleName,
    accounts: (state) => state.accounts,
    wallets: (state) => {
      var wallets = []
      if (state.accounts) {
        state.accounts.forEach((account) => {
          var t = account.wallets.map((wallet) => {
            var balance = wallet.balance
            var total = wallet.balance.coins_total.str({ precision: 3 })

            return {
              name: wallet.wallet_name,
              address: wallet.address,
              totalAmount: total,
              transaction: balance.transactions,
              holder: account,
              currency: wallet.balance._chain_type.currency_unit(),
              isAuthenticated: nbhService.getWalletAuthStatus(wallet.address).then(status => {
                if (status) return status.data.auths[0]
                return false
              })
            }
            // })
          })
          wallets.push(...t)
        })

        return wallets
      }
    },
    syncing: state => state.syncing,
    intervalIsSet: state => state.intervalIsSet
  }
})

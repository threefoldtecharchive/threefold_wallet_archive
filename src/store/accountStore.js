import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
export default ({
  state: {
    // account: window.localStorage.getItem('account') ? JSON.parse(window.localStorage.getItem('account')) : null,
    // addressBook: {},
    syncing: false,
    transactionSubmitted: false,
    accounts: null
  },
  actions: {
    login(context, userData) {
      console.log(userData)
      var tfAccount = new tfchain.Account(
        `tft:${userData.doubleName}`,
        userData.doubleName, {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )

      var gfASeed = [...userData.seed] //Copy by value
      gfASeed[gfASeed.length - 1] = 'g'.charCodeAt(0) // Otherwise the wallet address would be the same, makes for confusing user experience
      gfASeed = new Uint8Array(gfASeed)

      var gfAccount = new tfchain.Account(
        `gft:${userData.doubleName}`,
        userData.doubleName, {
          seed: gfASeed,
          network: config.gftNetwork,
          chain: 'GOLDCHAIN'
        },
      )

      context.commit('setAccounts', [tfAccount, gfAccount])
      context.dispatch('updateAccounts')
      context.dispatch('createWallet', { chain: 'tft', walletName: 'Daily' })
      context.dispatch('createWallet', { chain: 'tft', walletName: 'Holiday' })
      context.dispatch('createWallet', { chain: 'gft', walletName: 'GFT_Daily' })
      context.dispatch('createWallet', { chain: 'gft', walletName: 'GFT_Holiday' })
    },
    updateAccounts(context) {
      context.getters.accounts.forEach(account => {
        if (account && !context.getters.syncing) {
          context.commit('setSync', true)
          account.update_account((updatedAccount) => {
            context.commit('setSync', false)
          })
        }
      })

      setInterval(() => {
        context.dispatch('updateAccounts')
      }, 60000)
    },
    createWallet: (context, data) => {
      var account = context.getters.accounts.find(x => x.account_name.split(':')[0] === data.chain)
      if (account) {
        account.wallet_new(data.walletName, account.wallet_count, 1)
        // pkid.setWallets(account, account.wallets)
      }
    },
    sendCoins: (context, data) => {
      context.commit('setSync', true)
      console.log('sending in store', data)
      var account = context.getters.accounts.find(acc => acc.account_name.split(':')[0] === data.chain)
      if (account) {
        var wallet = account.wallets.find(w => w.address === data.from)
        console.log(wallet)
        if (wallet) {
          context.commit('setInformationMessage', `Submitting transaction...`)
          const builder = wallet.transaction_new()
          var sender = JSON.stringify({
            account: account.account_name,
            walletname: wallet.wallet_name
          })
          builder.output_add(data.to.toString(), data.amount.toString())
          console.log("sending", sender, builder)
          builder.send({
            sender,
            message: data.message
          }).then(result => {
            if (result.submitted) {
              context.commit('setInformationMessage', `Transaction submitted  (${result.transaction.id.substring(4, 0)})...`)
              context.dispatch('updateAccount')
              context.commit('setSync', false)
            } else {
              console.log("then else...")
            }
          }).catch(err => {
            console.error(`ERROR while sending coins`, err)
            throw err
          })
        }
      }
    }
  },
  mutations: {
    setDoubleName: (state, doubleName) => { state.doubleName = doubleName },
    setSeed: (state, seed) => { state.seed = seed },
    setSync: (state, syncing) => { state.syncing = syncing },
    setAccounts: (state, accounts) => {
      // window.localStorage.setItem('account', JSON.stringify(account))
      state.accounts = accounts
    },
    setTransactionSubmitted(state, submitted) {
      state.transactionSubmitted = submitted
    },
    updateAddressBook: (state, transactions) => {
    }
  },
  getters: {
    accounts: (state) => state.accounts,
    wallets: (state) => {
      var wallets = []
      if (state.accounts) {
        state.accounts.forEach(account => {
          var t = account.wallets.map(wallet => {
            var balance = wallet.balance
            var total = wallet.balance.coins_total.str({ precision: 3 })
            // console.log(wallet)
            return {
              name: wallet.wallet_name,
              address: wallet.address,
              totalAmount: total,
              transaction: balance.transactions,
              holder: account,
              currency: wallet.balance._chain_type.currency_unit(),
              status: ((wallet.balance._chain_type.currency_unit() === "TFT") ? "noStatus" : account.coin_auth_status_for_address_get(wallet.address) ? "verified" : "unverified")
            }
          })
          wallets.push(...t)
        })
        return wallets
      }
    },
    syncing: state => state.syncing,
    transactionSubmitted: state => state.transactionSubmitted
  }
})

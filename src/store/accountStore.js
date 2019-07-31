import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
export default({
  state: {
    account: window.localStorage.getItem('account') ? JSON.parse(window.localStorage.getItem('account')) : null,
    addressBook: {},
    syncing: false,
    transactionSubmitted: false,
    accounts: []
  },
  actions: {
    login (context, userData) {
      var account = new tfchain.Account(
        userData.doubleName,
        userData.doubleName, {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )
      // var gfAccount = new tfchain.Account(
      //   userData.doubleName,
      //   userData.doubleName, {
      //     seed: userData.seed,
      //     network: config.tftNetwork
      //   },

      // )
      context.commit('setAccount', account)
      context.dispatch('updateAccount')
      context.dispatch('createWallet', 'Daily')
      context.dispatch('createWallet', 'Holiday')
      context.dispatch('createWallet', 'GFT test')
    },
    updateAccount (context) {
      var account = context.getters.account
      if (account && !context.getters.syncing) {
        context.commit('setSync', true)
        account.update_account((updatedAccount) => {
          context.commit('setSync', false)
          context.commit('setAccount', updatedAccount)
          const wallets = context.getters.wallets
          wallets.forEach(wallet => {
            // console.log(`wallet`, wallet)
          })
        })
      }
      setInterval(() => {
        context.dispatch('updateAccount')
      }, 60000)
    },
    createWallet: (context, walletName) => {
      var account = context.getters.account
      if (account) {
        account.wallet_new(walletName, account.wallet_count, 1)
        // pkid.setWallets(account, account.wallets)
      }
    },
    sendCoins: (context, data) => {
      context.commit('setSync', true)
      console.log('sending in store', data)
      var account = context.getters.account
      console.log(account)
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
            console.log("thenneben")
            console.log('Sent??', result)
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
    setAccount: (state, account) => {
      // window.localStorage.setItem('account', JSON.stringify(account))
      state.account = account
    },
    setTransactionSubmitted (state, submitted) {
      state.transactionSubmitted = submitted
    },
    updateAddressBook: (state, transactions) => {
    }
  },
  getters: {
    account: (state) => state.account,
    wallets: (state) => state.account ? state.account.wallets.map(wallet => {
      var balance = wallet.balance
      var total = wallet.balance.coins_total.str({ precision: 3 })
      return {
        name: wallet.wallet_name,
        address: wallet.address,
        totalAmount: total,
        transaction: balance.transactions
      }
    }) : null,
    syncing: state => state.syncing,
    transactionSubmitted: state => state.transactionSubmitted
  }
})

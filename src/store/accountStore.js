import { sortBy } from 'lodash'
import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
export default({
  state: {
    account: null,
    syncing: false
  },
  actions: {
    login (context, userData) {
      console.log(`login`, userData)
      var account = new tfchain.Account(
        userData.doubleName,
        userData.doubleName, {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )
      console.log(`account`, account)
      context.commit('setAccount', account)
      context.dispatch('updateAccount')
      context.dispatch('createWallet', 'default')
      context.dispatch('createWallet', 'testWallet')
    },
    updateAccount (context) {
      var account = context.getters.account
      if (account) {
        var now = new Date()
        var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
        console.log(`updating account ${time} ${account.account_name}`)
        context.commit('setSync', true)
        account.update_account((updatedAccount) => {
          context.commit('setSync', false)
          context.commit('setAccount', updatedAccount)
        })
      }
    },
    createWallet: (context, walletName) => {
      var account = context.getters.account
      if (account) {
        account.wallet_new(walletName, account.wallet_count, 1)
        // pkid.setWallets(account, account.wallets)
      }
    },
    sendCoins: (context, data) => {
      var account = context.getters.account
      if (account) {
        console.log(`Sending coins`, data, account)
        var wallet = account.wallets.find(w => w.wallet_name === data.from)
        if (wallet) {
          const builder = wallet.transaction_new()
          var sender = JSON.stringify({
            account: account.account_name,
            walletname: wallet.wallet_name
          })
          console.log(`sender`, sender)
          builder.output_add(data.to.toString(), data.amount.toString())
          builder.send({
            sender,
            message: data.message
          }).then(result => {
            console.log(`RESULT`, result)
            if (result.submitted) {
              context.commit('setInformationMessage', `Transaction submitted  (${result.transaction.id.substring(4, 0)})...`)
              context.dispatch('updateAccount')
            }
          }).catch(err => {
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
    setAccount: (state, account) => { state.account = account }
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
    syncing: state => state.syncing
  }
})

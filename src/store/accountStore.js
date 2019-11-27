import config from '../../public/config'
import * as tfchain from '../services/tfchain/api'
import nbhService from '../services/nbhService'
export default ({
  state: {
    // account: window.localStorage.getItem('account') ? JSON.parse(window.localStorage.getItem('account')) : null,
    // addressBook: {},
    syncing: false,
    accounts: null,
    intervalIsSet: false
  },
  actions: {
    login (context, userData) {
      console.log(userData)
      // context.dispatch('setPkidClient', userData.seed)

      var tfAccount = new tfchain.Account(
        `tft:${userData.doubleName}`,
        userData.doubleName, {
          seed: userData.seed,
          network: config.tftNetwork
        }
      )

      // var gfASeed = [...userData.seed] //Copy by value
      // gfASeed[gfASeed.length - 1] = 'g'.charCodeAt(0) // Otherwise the wallet address would be the same, makes for confusing user experience
      // gfASeed = new Uint8Array(gfASeed)

      // var gfAccount = new tfchain.Account(
      //   `gft:${userData.doubleName}`,
      //   userData.doubleName, {
      //     seed: gfASeed,
      //     network: config.gftNetwork,
      //     chain: 'GOLDCHAIN'
      //   },
      // )

      // Temp for dev
      // var gfAccount = new tfchain.Account(
      //   `gft:${userData.doubleName}`,
      //   userData.doubleName,
      //   {
      //     network: "devnet",
      //     addresses: ["http://localhost:2015"],
      //     chain: 'GolDcHaIn',
      //     seed: gfASeed
      //   },
      // )

      context.commit('setAccounts', [tfAccount])

      context.dispatch('updateAccounts')

      context.dispatch('createWallet', { chain: 'tft', walletName: 'daily' })
      context.dispatch('createWallet', { chain: 'tft', walletName: 'savings' })

      // context.dispatch('createWallet', { chain: 'gft', walletName: 'gold tokens' })
      // context.dispatch('createWallet', { chain: 'gft', walletName: 'gold tokens savings' })
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
      var account = context.getters.accounts.find(x => x.account_name.split(':')[0] === data.chain)

      if (account) {
        account.wallet_new(data.walletName, account.wallet_count, 1)
        // pkid.setWallets(account, account.wallets)
      }
    }
  },
  mutations: {
    setIntervalIsSet: (state, bool) => { state.intervalIsSet = bool },
    setDoubleName: (state, doubleName) => { state.doubleName = doubleName },
    setSeed: (state, seed) => { state.seed = seed },
    setSync: (state, syncing) => { state.syncing = syncing },
    setAccounts: (state, accounts) => {
      // window.localStorage.setItem('account', JSON.stringify(account))
      state.accounts = accounts
    },
    updateAddressBook: (state, transactions) => {
    }
  },
  getters: {
    accounts: (state) => state.accounts,
    wallets: (state) => {
      var wallets = []
      if (state.accounts) {
        state.accounts.forEach((account) => {
          var t = account.wallets.map((wallet) => {
            var balance = wallet.balance
            // balance.transactions.forEach(x => x._sender = JSON.parse(x._sender))
            var total = wallet.balance.coins_total.str({ precision: 3 })

            // console.log(account.account_name, account.coin_auth_status_for_account_get(account))
            // console.log(wallet.address, account.coin_auth_status_for_address_get(wallet.address))

            // console.log(wallet.address)
            return {
              name: wallet.wallet_name,
              address: wallet.address,
              totalAmount: total,
              transaction: balance.transactions,
              holder: account,
              currency: wallet.balance._chain_type.currency_unit(),
              // status: ((wallet.balance._chain_type.currency_unit() === "TFT") ? "noStatus" : account.coin_auth_status_for_address_get(wallet.address) ? "verified" : "unverified")
              isAuthenticated: nbhService.getWalletAuthStatus(wallet.address).then(status => {
                if (status) return status.data.auths[0]
                return false
              })
            }
            // })
          })
          wallets.push(...t)
        })

        // // faking gold wallet
        // let amount = 500
        // let transactions = []
        // wallets.forEach(wallet => {
        //   // sender is faucet
        //   let sender = '0178C06A59ECA06CA656C400CFC5960DA128162A8AA122A41B1051BFF93D4C10C17B024CC8AF88'
        //   wallet.transaction.filter(x => x.inputs.length  && x.inputs[0].senders[0] === sender.toLowerCase()).forEach(transaction => {
        //     if(transaction.confirmed) amount -= parseFloat(transaction.inputs[0].amount.str())
        //     let myObj = cloneDeep(transaction)
        //     myObj._outputs = cloneDeep(transaction._inputs)
        //     delete myObj._inputs
        //     transactions.push(cloneDeep(myObj))
        //   })
        //   // receiver is alex' gft wallet
        //   let receiver = '01527bb9b6852cc565c0f19a7fcd0ef764e57808552adb4ab16c7764e40cd37673c303578ddff9'
        //   wallet.transaction.filter(x => x.outputs.length && x.outputs[0].recipient === receiver.toLowerCase()).forEach(transaction => {
        //     if(transaction.confirmed) amount += parseFloat(transaction.outputs[0].amount.str())
        //     let myObj = cloneDeep(transaction)
        //     myObj._inputs = cloneDeep(transaction._outputs)
        //     delete myObj._outputs
        //     transactions.push(cloneDeep(myObj))
        //   })
        // })

        // let isAuthenticated = false
        // wallets.filter(x=>x.currency=='GFT').forEach(x => {
        //   if (!isAuthenticated) isAuthenticated = x.isAuthenticated.then(r => {return r})
        // })
        // wallets.push({
        //   name: 'physical gold',
        //   address: '01ca604e0cee992bcbace7c8201a3898a4c56ce3aa5503546bfakegoldfakegoldfakegoldfake',
        //   totalAmount: amount.toString(),
        //   transaction: transactions.sort((a, b) => b.timestamp - a.timestamp),
        //   holder: {
        //     account_name: wallets[0].holder.account_name
        //   },
        //   currency: 'gram',
        //   isAuthenticated: isAuthenticated
        // })
        return wallets
      }
    },
    syncing: state => state.syncing,
    intervalIsSet: state => state.intervalIsSet
  }
})

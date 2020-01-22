import uuidv4 from 'uuid/v4'

const pkidUrl = 'http://localhost:8080'

import Pkid from '@jimber/pkid'
import sodium from 'libsodium-wrappers'

export default ({
  state: {
    client: null
  },
  actions: {
    async setPkidClient (context, payload) {
      // const keyPair = await generateKeypair(payload)
      await sodium.ready
      const keyPair = sodium.crypto_sign_seed_keypair(payload)

      const client = new Pkid(pkidUrl, keyPair)
      context.commit('setPkidClient', client)
    },
    async getPkidWallets (context) {
      const client = context.getters.client
      const data = await client.getDoc(client.keyPair.publicKey, 'wallets')
      if (!data.success) {
        if (data.status === 404) {
          return null
        }
        // @todo: handel this situation
        throw new Error()
      }
      return data.data
    },
    setPkidWallets (context, wallets) {
      context.getters.client.setDoc('wallets', wallets, true)
    },
    setPkidImportedAccounts (context, accounts) {
      context.getters.client.setDoc('imported_accounts', accounts, true)
    },
    async getPkidImportedAccounts (context) {
      const client = context.getters.client
      const data = await client.getDoc(client.keyPair.publicKey, 'imported_accounts')
      if (!data.success) {
        if (data.status === 404) {
          return null
        }
        // @todo: handel this situation
        throw new Error()
      }
      return data.data
    },
    async addImportedWallet (context, postMessage) {
      const wallets = await context.dispatch('getPkidImportedAccounts')
      await context.dispatch('setPkidImportedWallets', [...wallets, postMessage])
    },
    async updatePkidWallets (context) {

      const accounts = context.getters.accounts

      const appAccount = accounts[0]

      const appWallets = appAccount.wallets.map(wallet => {
        return {
          walletName: wallet.wallet_name,
          doubleName: appAccount.doubleName,
          index: wallet.address_count
        }
      })
      await context.dispatch('setPkidWallets', appWallets)

      const importedAccounts = accounts.filter(account => account.type === 'imported')

      const mappedImportedAccounts = importedAccounts.map(account => {
        return {
          walletName: account.wallet.wallet_name,
          doubleName: account.password,
          seed: Array.from(account.seed)
        }
      })

      await context.dispatch('setPkidImportedAccounts', mappedImportedAccounts)
    },
    async removePkidWallet (context, wallet) {

      const accounts = context.getters.accounts.filter(account => account !== wallet.holder)

      context.commit('setAccounts', accounts)
      context.dispatch('updateAccounts')
    },
    getPkidUser (context, pk) {
      const client = context.getters.client
      client.getDoc(pk, 'user')
    },
    setPkidUser (context, user) {
      const client = context.getters.client
      client.setDoc('user', user)
    }
  },
  mutations: {
    setPkidClient (state, payload) {
      state.client = payload
    }
  },
  getters: {
    client: (state) => state.client
  }
})

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
      console.log(data);
      if (!data.success) {
        if (data.status === 404) {
          return null
        }

        throw new Error()
      }
      return data.data
    },
    setPkidWallets (context, wallets) {
      console.log('wallets')
      console.log(wallets)
      context.getters.client.setDoc('wallets', wallets, true)
    },
    async addImportedWallet (context, postMessage) {
      const wallets = await context.dispatch('getPkidWallets')
      await context.dispatch('setPkidWallets', [...wallets, postMessage])
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

const pkid = require('@jimber/pkid')
const pkidUrl = 'https://pkid.staging.jimber.org'
const { sign } = require('tweetnacl')
export default({
  state: {
    client: null
  },
  actions: {
    setPkidClient (context, payload) {
      let keyPair = sign.keyPair.fromSeed(payload)
      context.commit('setPkidClient', new pkid(pkidUrl, keyPair.publicKey, keyPair.secretKey))
      context.dispatch('setPkidWallets', ['hello'])
      setTimeout(() => {
        context.dispatch('getPkidWallets', keyPair.publicKey)
      }, 1500)
    },
    async getPkidWallets (context, pk) {
      let client = context.getters.client
      let res = await client.getDoc(pk, 'wallets')
    },
    async setPkidWallets (context, wallets) {
      let client = context.getters.client
      let res = await client.setDoc('wallets', wallets)
    },
    getPkidUser (context, pk) {
      let client = context.getters.client
      client.getDoc(pk, 'user')
    },
    setPkidUser (context, user) {
      let client = context.getters.client
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

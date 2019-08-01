import botService from '../services/3botService'
import config from '../../public/config'
import cryptoService from '../services/cryptoService'
import { decodeBase64 } from 'tweetnacl-util'

export default ({
  state: {
    state: window.localStorage.getItem('state') || null,
    keys: window.localStorage.getItem('tempKeys') ? JSON.parse(window.localStorage.getItem('tempKeys')) : null,
    loginUrl: null
  },
  actions: {
    async generateLoginUrl (context) {
      context.dispatch('clearStorage')
      var state = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < 20; i++) {
        state += characters.charAt(Math.floor(Math.random() * charactersLength))
      }

      var keys = await cryptoService.generateKeys()
      var appid = config.appId
      var scope = config.scope
      context.commit('setState', state)
      context.commit('setKeys', keys)

      context.commit('setLoginUrl', `${config.botFrontEnd}?state=${state}&scope=${scope}&appid=${appid}&publickey=${encodeURIComponent(keys.publicKey)}&redirecturl=${encodeURIComponent(config.redirect_url)}`)
    },
    async checkResponse (context, responseUrl) {
      var username = responseUrl.searchParams.get('username')
      var signedHash = responseUrl.searchParams.get('signedhash')

      // TODO check state
      if (responseUrl.searchParams.get('error')) {
        context.commit('setFatalError', responseUrl.searchParams.get('error'))
      } else {
        botService.getUserData(username).then(async (response) => {
          cryptoService.validateSignature(signedHash, response.data.publicKey)
            .then(x => {
              console.log(x)
              if (context.getters.state !== x) {
                context.commit('setFatalError', `Invalid state. Should be ${context.getters.state} but was ${x}`)
              } else {
                var data = responseUrl.searchParams.get('data')
                if (!data) {
                  context.commit('setFatalError', 'Got no data from 3bot')
                } else {
                  data = JSON.parse(data)
                  var keys = context.getters.keys
                  var userData = {}
                  console.log(data, keys, response)
                  cryptoService.decrypt(data.ciphertext, data.nonce, keys.privateKey, response.data.publicKey)
                    .then(decrypted => {
                      console.log(decrypted)
                      if (decrypted) {
                        decrypted = JSON.parse(decrypted)
                        for (var k in decrypted) {
                          if (decrypted.hasOwnProperty(k)) {
                            userData[k] = decrypted[k]
                          }
                        }
                      }
                      console.log(userData)
                      var newSeed = new Uint8Array(decodeBase64(userData.keys.derivedPrivateKey))
                      console.log(`newSeed`, newSeed)
                      const userObject = {doubleName: username, seed: newSeed}
                      window.localStorage.setItem("user",JSON.stringify(userObject))
                      context.dispatch('login', 
                        userObject
                        // doubleName: username,
                        // seed: newSeed // (userData.seed || 'buzz sock ten heavy occur grant grant oil tip awful warrior need asthma device actor promote imitate record air ring pottery company analyst ride')
                      )
                    }).catch(e => {
                      console.log(e)
                      context.commit('setFatalError', 'Could not decrypt message.')
                    })
                }
              }
            })
            .catch(e => context.commit('setFatalError', 'Signature failed, please try again.'))
        })
      }
    },
    clearStorage (context) {
      context.commit('setState', null)
      context.commit('setKeys', null)
    }
  },
  mutations: {
    setKeys (state, keys) {
      window.localStorage.setItem('tempKeys', JSON.stringify(keys))
      state.keys = keys
    },
    setState (state, stateHash) {
      window.localStorage.setItem('state', stateHash)
      state.state = stateHash
    },
    setLoginUrl (state, url) {
      state.loginUrl = url
    }
  },
  getters: {
    keys: (state) => state.keys,
    state: (state) => state.state,
    loginUrl: (state) => state.loginUrl
  }
})

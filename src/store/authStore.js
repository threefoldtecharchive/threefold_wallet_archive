/* eslint-disable no-console */
import botService from '../services/3botService'
import config from '../../public/config'
import cryptoService from '../services/cryptoService'
import { decodeBase64 } from 'tweetnacl-util'

// @TODO: does the authstore need to exist anymore

export default {
  state: {
    state: window.localStorage.getItem('state') || null,
    keys: window.localStorage.getItem('tempKeys')
      ? JSON.parse(window.localStorage.getItem('tempKeys'))
      : null,
    loginUrl: null
  },
  actions: {
    async generateLoginUrl (context) {
      context.dispatch('clearStorage')
      var state = ''
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < 20; i++) {
        state += characters.charAt(Math.floor(Math.random() * charactersLength))
      }

      var keys = await cryptoService.generateKeys()
      var appid = config.appId
      var scope = config.scope
      context.commit('setState', state)
      context.commit('setKeys', keys)

      context.commit(
        'setLoginUrl',
        `${
          config.botFrontEnd
        }?state=${state}&scope=${scope}&appid=${appid}&publickey=${encodeURIComponent(
          keys.publicKey
        )}&redirecturl=${encodeURIComponent(config.redirect_url)}`
      )
    },
    async checkResponse (context, responseUrl) {
      if (responseUrl.searchParams.get('error')) {
        context.commit('setFatalError', responseUrl.searchParams.get('error'))
        return
      }

      // this is the iphone path, should be removed. Uses derivedseed straight from URL after hash
      var username = responseUrl.searchParams.get('username')
      var signedHash = responseUrl.searchParams.get('signedhash')
      var directLoginData
      if (window.location.hash) {
        directLoginData = window.location.hash
          .substr(1)
          .split('&')
          .reduce(function (result, item) {
            var parts = item.split('=')
            result[parts[0]] = decodeURIComponent(parts[1])
            return result
          }, {})
        var newSeed = new Uint8Array(decodeBase64(directLoginData.derivedSeed))
        const userObject = {
          doubleName: directLoginData.username,
          seed: newSeed
        }
        await context.dispatch('login', userObject)

        const importedWallets = JSON.parse(
          window.localStorage.getItem('importedWallets')
        )
        if (!(importedWallets != null && importedWallets)) {
          return
        }
        for (const user of importedWallets.filter(
          x => x.doubleName === directLoginData.doubleName
        )) {
          user.seed = new Uint8Array(user.seed)
          await context.dispatch('importWallet', user)
        }
        return
      }
      // this is the Android and normal login path
      try {
        const response = await botService.getUserData(username)

        if (
          signedHash &&
          context.getters.state !==
            (await cryptoService.validateSignature(
              signedHash,
              response.data.publicKey
            ))
        ) {
          context.commit('setFatalError', 'Invalid state.')
        }
        // http://localhost:8080/login#username=ivan&derivedSeed=abc123
        const responseData = responseUrl.searchParams.get('data')
        if (!responseData) {
          context.commit('setFatalError', 'Got no data from 3bot')
          return
        }

        // eslint-disable-next-line no-unused-vars
        const data = JSON.parse(responseData)
        const keys = context.getters.keys
        const userData = {}
        try {
          const decryptedData = await cryptoService.decrypt(
            data.ciphertext,
            data.nonce,
            keys.privateKey,
            response.data.publicKey
          )
          if (decryptedData) {
            const decrypted = JSON.parse(decryptedData)
            for (const k in decrypted) {
              if (decrypted.hasOwnProperty(k)) {
                userData[k] = decrypted[k]
              }
            }
          }

          newSeed = new Uint8Array(decodeBase64(userData.derivedSeed))
          const userObject = {
            doubleName: username,
            seed: newSeed
          }
          await context.dispatch('login', userObject)
        } catch (e) {
          context.commit('setImportingWallets', false)
          console.log(e)
          return context.commit('setFatalError', e.message)
        }
      } catch (e) {
        // context.commit('setFatalError', 'Signature failed, please try again.')
        // We can't do this because we need to be able to login from the browser. (I think)
        context.dispatch('generateLoginUrl')
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
    keys: state => state.keys,
    state: state => state.state,
    loginUrl: state => state.loginUrl
  }
}

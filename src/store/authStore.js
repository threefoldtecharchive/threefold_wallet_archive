/* eslint-disable no-console */
import botService from '../services/3botService';
import config from '../../public/config';
import cryptoService from '../services/cryptoService';
import { decodeBase64 } from 'tweetnacl-util';


//@todo: does the authstore need to exist anymore

export default {
  state: {
    state: localStorage.getItem('state') || null,
    keys: localStorage.getItem('tempKeys')
      ? JSON.parse(localStorage.getItem('tempKeys'))
      : null,
    loginUrl: null
  },
  actions: {
    async generateLoginUrl (context) {
      context.dispatch('clearStorage');
      var state = '';
      var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < 20; i++) {
        state += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      var keys = await cryptoService.generateKeys();
      var appid = config.appId;
      var scope = config.scope;
      context.commit('setState', state);
      context.commit('setKeys', keys);

      context.commit(
        'setLoginUrl',
        `${
          config.botFrontEnd
        }?state=${state}&scope=${scope}&appid=${appid}&publickey=${encodeURIComponent(
          keys.publicKey
        )}&redirecturl=${encodeURIComponent(config.redirect_url)}`
      );
    },
    async checkResponse(context, responseUrl) {
      console.log('testetstests');
      if (responseUrl.searchParams.get('error')) {
        context.commit('setFatalError', responseUrl.searchParams.get('error'));
      } else {
        // this is the iphone path, should be removed. Uses derivedseed straight from URL after hash
        var username = responseUrl.searchParams.get('username');
        var signedHash = responseUrl.searchParams.get('signedhash');
        var directLoginData;
        if (window.location.hash) {
          directLoginData = window.location.hash
            .substr(1)
            .split('&')
            .reduce(function(result, item) {
              var parts = item.split('=');
              result[parts[0]] = decodeURIComponent(parts[1]);
              return result;
            }, {});
          var newSeed = new Uint8Array(
            decodeBase64(directLoginData.derivedSeed)
          );
          const userObject = {
            doubleName: directLoginData.username,
            seed: newSeed
          };
          // window.localStorage.setItem('user', JSON.stringify(userObject))
          context.dispatch('login', userObject);

          let importedWallets = JSON.parse(
            localStorage.getItem('importedWallets')
          );
          if (importedWallets != null && importedWallets) {
            for (let user of importedWallets.filter(
              x => x.doubleName === directLoginData.doubleName
            )) {
              user.seed = new Uint8Array(user.seed);
              await context.dispatch('importWallet', user);
            }
          }
        } else {
          // this is the Android and normal login path
          botService
            .getUserData(username)
            .then(async response => {
              console.log(response);
              console.log(signedHash, response.data.publicKey);
              console.log(
                'cr3',
                await cryptoService.validateSignature(
                  signedHash,
                  response.data.publicKey
                )
              );
              if (
                signedHash &&
                context.getters.state !==
                  (await cryptoService.validateSignature(
                    signedHash,
                    response.data.publicKey
                  ))
              ) {
                context.commit('setFatalError', `Invalid state.`);
              }
              // http://localhost:8080/login#username=ivan&derivedSeed=abc123
              var data = responseUrl.searchParams.get('data');
              console.log(`Data ivan`,data)
              if (data) {
                data = JSON.parse(data);
                var keys = context.getters.keys;
                var userData = {};
                cryptoService
                  .decrypt(
                    data.ciphertext,
                    data.nonce,
                    keys.privateKey,
                    response.data.publicKey
                  )
                  .then(decrypted => {
                    console.log(`decrypted`, decrypted)
                    if (decrypted) {
                      decrypted = JSON.parse(decrypted);
                      for (var k in decrypted) {
                        if (decrypted.hasOwnProperty(k)) {
                          userData[k] = decrypted[k];
                        }
                      }
                    }
                    var newSeed = new Uint8Array(
                      decodeBase64(userData.derivedSeed)
                    );
                    const userObject = {
                      doubleName: username,
                      seed: newSeed
                    };

                    // window.localStorage.setItem('user', JSON.stringify(userObject))
                    context.dispatch('login', userObject);

                    let importedWallets = JSON.parse(
                      localStorage.getItem('importedWallets')
                    );
                    console.log(`importedwallets `, importedWallets)

                    if (
                      importedWallets != null &&
                      importedWallets.filter(
                        x => x.doubleName === userObject.doubleName
                      )
                    ) {
                      for (let user of importedWallets) {
                        user.seed = new Uint8Array(user.seed);
                        // @todo: check if necessary to make await
                        context.dispatch('importWallet', user);
                      }
                    }
                  })
                  .catch(e =>
                    context.commit(
                      'setFatalError',
                      'Could not decrypt message.'
                    )
                  );
              } else {
                console.log(`Else After data`,data)
                context.commit('setFatalError', 'Got no data from 3bot');
              }
            })
            .catch(e => {
              console.log(`e`, e);
              // context.commit('setFatalError', 'Signature failed, please try again.')
              // We can't do this because we need to be able to login from the browser. (I think)
              console.log('Username was null, redirecting .... ');
              context.dispatch('generateLoginUrl');
            });
        }
      }
    },
    clearStorage(context) {
      context.commit('setState', null);
      context.commit('setKeys', null);
    }
  },
  mutations: {
    setKeys(state, keys) {
      console.log(`insetKeys`);
      localStorage.setItem('tempKeys', JSON.stringify(keys));
      state.keys = keys;
    },
    setState(state, stateHash) {
      console.log(`insetState`);
      localStorage.setItem('state', stateHash);
      state.state = stateHash;
    },
    setLoginUrl(state, url) {
      state.loginUrl = url;
    }
  },
  getters: {
    keys: state => state.keys,
    state: state => state.state,
    loginUrl: state => state.loginUrl
  }
};

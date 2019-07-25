import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util'
import sodium from 'libsodium-wrappers'
const bip39 = require('bip39')

export default ({
  sign (message, privateKey) {
    return new Promise(async (resolve, reject) => {
      privateKey = decodeBase64(privateKey)
      var enc = sodium.crypto_sign(message, privateKey)
      resolve(encodeBase64(enc))
    })
  },
  validateSignature (signature, publicKey) {
    return new Promise(async (resolve, reject) => {
      await sodium.ready
      publicKey = decodeBase64(publicKey)
      signature = decodeBase64(signature)
      var unsigned = sodium.crypto_sign_open(signature, publicKey)
      resolve(encodeUTF8(unsigned))
    })
  },
  decrypt (message, nonce, privateKey, pubkey) {
    return new Promise(async (resolve, reject) => {
      await sodium.ready
      message = decodeBase64(message)
      privateKey = sodium.crypto_sign_ed25519_sk_to_curve25519(decodeBase64(privateKey))
      pubkey = sodium.crypto_sign_ed25519_pk_to_curve25519(decodeBase64(pubkey))
      nonce = decodeBase64(nonce)
      var decrypted = sodium.crypto_box_open_easy(message, nonce, pubkey, privateKey)
      decrypted = encodeUTF8(decrypted)
      resolve(decrypted)
    })
  },
  encrypt (message, privateKey, pubkey) {
    return new Promise(async (resolve, reject) => {
      message = new TextEncoder().encode(message)
      privateKey = sodium.crypto_sign_ed25519_sk_to_curve25519(decodeBase64(privateKey))
      pubkey = sodium.crypto_sign_ed25519_pk_to_curve25519(decodeBase64(pubkey))

      var nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
      var encrypted = sodium.crypto_box_easy(message, nonce, pubkey, privateKey)
      resolve({
        encrypted: encodeBase64(encrypted),
        nonce: encodeBase64(nonce)
      })
    })
  },
  generateKeys (phrase) {
    return new Promise(async (resolve, reject) => {
      await sodium.ready
      if (!phrase) {
        var seed = sodium.randombytes_buf(sodium.crypto_box_SEEDBYTES / 2)
        phrase = bip39.entropyToMnemonic(seed)
      }
      var ken = new TextEncoder().encode(bip39.mnemonicToEntropy(phrase))
      var keys = sodium.crypto_sign_seed_keypair(ken)
      resolve({
        privateKey: encodeBase64(keys.privateKey),
        publicKey: encodeBase64(keys.publicKey)
      })
    })
  },
  getEdPkInCurve (pubkey) {
    return encodeBase64(sodium.crypto_sign_ed25519_pk_to_curve25519(decodeBase64(pubkey)))
  }
})

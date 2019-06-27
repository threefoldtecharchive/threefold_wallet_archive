import axios from 'axios'
import config from '../../public/config'

export default ({
  getWalletsFromUser (doublename) {
    return axios.get(`${config.pubKeyStoreUrl}/users/${doublename}/storage/`)
  },
  setWallets (user, wallets) {
    console.log(`Saving wallets for user`, wallets, user)
    // return axios.put(`${config.pubKeyStoreUrl}/users/${user}/storage/`)
  }
})

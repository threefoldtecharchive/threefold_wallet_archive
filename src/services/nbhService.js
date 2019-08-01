import Axios from 'axios'
import config from '../../public/config'
export default ({
  async authAddress(address) {
    Axios.post(`${config.nbhFaucet}/request/authorize`,
      {
        uh: address,
        authorize: true
      }).catch(function (error) {
        console.log(error);
      })
  },
  async deAuthAddress(address) {
    Axios.post(`${config.nbhFaucet}/request/authorize`, {
      uh: address,
      authorize: false
    }).catch(function (error) {
      console.log(error);
    })
  },
})

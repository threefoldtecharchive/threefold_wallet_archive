import axios from 'axios'
const url = 'https://faucet.testnet.nbh-digital.com'
export default ({
	async goldTransaction(address, amount) {
		return axios({
      method: 'post',
      url: `${url}/api/v1/coins`,
      data: {
				"address": address,
				"amount": amount
			},
      headers: {
        'Content-Type': 'application/json'
      }
    })
	},
})
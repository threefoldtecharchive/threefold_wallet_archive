import goldService from '../services/faucetGoldService'
export default ({
  state: {

  },
  actions: {
    sendCoins: (context, data) => {
			console.log(data);
			let type = data.type.toLowerCase()
			if (type == 'gram/gft' || type == 'gft/gram') context.dispatch('transferGold', data)
			else if (type == 'gft/gft' || type == 'tft/tft') context.dispatch('transferCoins', data)
			else context.commit('setInformationMessage', `This transaction is currently not supported`)
		},
		transferGold: async (context, data) => {
			// gram/gft => sell gold for gft
				try {
					let type = data.type.toLowerCase()
					if (type == 'gram/gft') {	
						await goldService.goldTransaction(data.to, parseInt(data.amount))
					}
					else if (type == 'gft/gram') {
						context.dispatch('transferCoins', {
							to: '01527bb9b6852cc565c0f19a7fcd0ef764e57808552adb4ab16c7764e40cd37673c303578ddff9',
							from: data.from,
							currency: 'GFT',
							amount: data.amount
						})
					}
				} catch (e) {
					context.commit('setInformationMessage', `Something went wrong with your transaction`)
				}
		},
		transferCoins: (context, data) => {
			 try {
				let fromAccount = context.getters.accounts.filter(account => { return account.wallets.find(wallet => wallet.address === data.from); })[0];
				let fromWallet;

				if(fromAccount) {
					fromWallet = fromAccount.wallets.find(wallet => wallet.address === data.from);
				} else {
					console.error('fromAccount could not be found.');
					return;
				}

				if(fromWallet) {
					context.commit('setInformationMessage', `Submitting transaction...`);

					const builder = fromWallet.transaction_new();

					var sender = JSON.stringify({
		 				account: fromAccount.account_name,
		 				walletname: fromWallet.wallet_name
					});
					 
					builder.output_add(data.to.toString(), data.amount.toString())

					let builderMessage = data.message ? { sender, message: data.message } : sender;

					builder.send(builderMessage).then(result => {
						if (result.submitted) {
							context.commit('setInformationMessage', `Transaction submitted  (${result.transaction.id.substring(4, 0)})...`);
							context.dispatch('updateAccounts');

							context.commit('setSync', false);
						}
					})
					return;
				} else {
					console.error('fromWallet could not be found.');
					return;
				}

			 } catch(exception) {
				 console.error('Something when wrong when executing transferCoins: ', exception);
			 }
		}
  },
  mutations: {

  },
  getters: {

  }
})
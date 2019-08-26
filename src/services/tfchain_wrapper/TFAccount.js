import * as tfchain from '../tfchain/api'

export class TFAccount {
  constructor (name, seed, network) {
    this.name = name
    this.seed = seed
    this.network = network

    this.account = new tfchain.Account(this.name, this.name, {
      seed: this.seed,
      network: this.network
      
    })

    this.address = this.account.address
    this.wallets = this.account.wallets
  }

  getAllTransactions () {
    return this.account.balance.then((result) => {
      return result.transactions
    })
  }

  getTransactions (walletName) {
    return this.account.wallets.find((result) => result.wallet_name === walletName).balance.then((result) => {
      return result.transactions
    })
  }

  getCoins (walletName, precision = 3) {
    return this.account.balance.then(function (balanceResult) {
      var balance = balanceResult.balances.find((result) => result.wallet_name === walletName)
      return {
        'coins_locked': balance.coins_locked.str({ precision }),
        'coins_total': balance.coins_total.str({ precision }),
        'coins_unlocked': balance.coins_unlocked.str({ precision }),
        'unconfirmed_coins_locked': balance.unconfirmed_coins_locked.str({ precision }),
        'unconfirmed_coins_total': balance.unconfirmed_coins_total.str({ precision }),
        'unconfirmed_coins_unlocked': balance.unconfirmed_coins_unlocked.str({ precision })
      }
    })
  }

  sendCoins (walletFrom, toAddress, amount) {
    const builder = walletFrom.transaction_new()

    builder.output_add(toAddress.toString(), amount.toString())
    return builder.send({ data: '' }).then(result => {
      if (result.submitted) {
        return result.transaction.id
      }
    }).catch(err => {
      throw err
    })
  }

  createWallet (name) {
    this.account.wallet_new(name, this.account.wallet_count, 1)
    this.address = this.account.address
    this.wallets = this.account.wallets
  }
}

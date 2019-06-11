<template>
  <h1>Hello</h1>
</template>

<script>
import * as tfchain from "../service/api"

export default {
  mounted() {

    var name = "mathias"
    var password = "mathias"

    // This should be generated!
    var seed = "lemon vocal marriage flash soft address barely crazy swarm alert hire riot find know around pill denial labor join spice energy planet deliver dress"
    // var seed = "group absurd recycle jacket march knock wear number flock future apart fatal hen enhance welcome net gather super earn ten hello rug patch grant"
    
    var network = "testnet"

    // api.
    const account = new tfchain.Account(name, password, {
        seed: seed,
        network: network
      })

    account.wallet_new('default', 0, 1)
    account.wallet_new('taiko', 1, 1)

    // account.balance.then(function(balence) {
    //   console.log("Balance: ", balance)
    // });

    console.log("account_name: ", account.account_name)
    console.log("address: " + account.address)
    console.log("account: ", account)
    console.log("wallet: ", account.wallet)
    console.log("balance: ", account.balance)
    console.log("balances: ", account.balances)
    console.log("info: ", account.info)

    account.balance.then(function(result) {
      console.log("Wallets:: ", result.balances)
      console.log("Wallet 0 Name: ", result.balances[0].wallet_name)
      console.log("Wallet 0: ", result.balances[0])

      console.log("Wallet 0 coins_total: ", result.balances[0].coins_total.str({ precision: 3 }))
      console.log("Wallet 0 coins_locked: ", result.balances[0].coins_locked.str({ precision: 3 }))
      console.log("Wallet 0 coins_unlocked: ", result.balances[0].coins_unlocked.str({ precision: 3 }))

      console.log("Wallet 0 unconfirmed_coins_locked: ", result.balances[0].unconfirmed_coins_locked.str({ precision: 3 }))
      console.log("Wallet 0 unconfirmed_coins_total: ", result.balances[0].unconfirmed_coins_total.str({ precision: 3 }))
      console.log("Wallet 0 unconfirmed_coins_unlocked: ", result.balances[0].unconfirmed_coins_unlocked.str({ precision: 3 }))

      console.log("Wallet 1 Name: ", result.balances[1].wallet_name)
      console.log("Wallet 1: ", result.balances[1])

      console.log("Wallet 1 coins_total: ", result.balances[1].coins_total.str({ precision: 3 }))
      console.log("Wallet 1 coins_locked: ", result.balances[1].coins_locked.str({ precision: 3 }))
      console.log("Wallet 1 coins_unlocked: ", result.balances[1].coins_unlocked.str({ precision: 3 }))

      console.log("Wallet 1 unconfirmed_coins_locked: ", result.balances[1].unconfirmed_coins_locked.str({ precision: 3 }))
      console.log("Wallet 1 unconfirmed_coins_total: ", result.balances[1].unconfirmed_coins_total.str({ precision: 3 }))
      console.log("Wallet 1 unconfirmed_coins_unlocked: ", result.balances[1].unconfirmed_coins_unlocked.str({ precision: 3 }))
    })
  }
};
</script>

<style> 
</style>

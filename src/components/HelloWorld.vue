<template>
  <h1>Hello</h1>
</template>

<script>
// import * as tfchain from "../services/tfchain/api";
import { TFAccount } from "../services/tfchain_wrapper/TFAccount";
import { setInterval } from "timers";

export default {
  mounted() {

    // Account initialization
    var account = new TFAccount(
      "Mathias",
      "lemon vocal marriage flash soft address barely crazy swarm alert hire riot find know around pill denial labor join spice energy planet deliver dress",
      "testnet"
    );

    // Create wallets.
    account.createWallet("default", 0, 1);
    account.createWallet("taiko", 1, 1);

    console.log('account :', account.account);

    account.getTransactions("default").then((transactions) => {
      console.log('default Transactions :', transactions);
    })

    account.getTransactions("taiko").then((transactions) => {
      console.log('taiko Transactions :', transactions);
    })

    account.getAllTransactions().then((transactions) => {
      console.log('All Transactions :', transactions);
    })

    // account.sendCoins("011c8eefdec5a4b6257bf931b11a846d007961eab73d5dafe9a4546fa2241d1dd625fee3f7c9d9", 
    //                   "01ef060241d60e5c92883369a4df855b61e1b837760b5782ff24b5b780ec1284e93b01015f156a",
    //                   1000)

    setInterval(function() {
         account.getCoins("default").then((result) => console.log('result :', result))
         account.getCoins("taiko").then((result) => console.log('result :', result))
    }, 3000)

     // Retrieving coins.
    account.getCoins("default").then((result) => console.log('result :', result))
    account.getCoins("taiko").then((result) => console.log('result :', result))
  }
};
</script>

<style>
</style>

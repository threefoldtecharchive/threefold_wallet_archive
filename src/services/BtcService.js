import { Asset, Operation, TransactionBuilder, Keypair } from 'stellar-base';
import axios from 'axios';
import { getConfig } from '@jimber/stellar-crypto';

/**
 * @param {Keypair} sourceKeyPair
 * @param {string} dest
 * @param {number} amount
 */
export const withdrawBTC = async (sourceKeyPair, dest, amount) => {
    const asset_code = 'BTC';
    const response = await axios.get(
        `https://cryptoanchor.io/stellar/withdraw?asset_code=${asset_code}&dest=${dest}&amount=${amount}`,
        {
            mode: 'no-cors',
        }
    );

    console.log(response);

    const {
        account_id,
        memo_type,
        memo,
        min_amount,
        fee_fixed,
    } = response.data;

    const { server, currencies, network } = getConfig();
    console.log({ server, currencies, network });
    const fee = String(await server.fetchBaseFee());

    console.log(sourceKeyPair.publicKey());

    const transactionAccount = await server.loadAccount(
        sourceKeyPair.publicKey()
    );

    const transaction = new TransactionBuilder(transactionAccount, {
        fee,
        networkPassphrase: network,
    });

    const asset = new Asset(asset_code, currencies[asset_code].issuer);
    transaction.addOperation(
        Operation.payment({
            destination: account_id,
            asset: asset,
            amount: amount.toFixed(7),
            source: sourceKeyPair.publicKey(),
        })
    );

    transaction.setTimeout(3000);
    const tx = transaction.build();

    console.log({ xdr: tx.toXDR() });

    //@todo: fund transaction
};

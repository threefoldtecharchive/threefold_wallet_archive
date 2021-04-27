import { Asset, Operation, TransactionBuilder, Keypair } from 'stellar-base';
import axios from 'axios';
import { getConfig, buildFundedPaymentTransaction, submitFundedTransaction } from '@jimber/stellar-crypto';

import Logger from 'js-logger';
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

    const { account_id, memo_type, memo, min_amount, fee_fixed } = response.data;

    const { server, currencies, network } = getConfig();
    console.log({ server, currencies, network });

    const fundedTransaction = await buildFundedPaymentTransaction(sourceKeyPair, account_id, amount, memo, asset_code);
    Logger.info('start withdraw');

    await submitFundedTransaction(fundedTransaction, sourceKeyPair);
    Logger.info('successfully withdrawn');
};

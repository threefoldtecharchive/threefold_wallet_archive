import {
    calculateWalletEntropyFromAccount,
    keypairFromAccount,
    revineAddressFromSeed,
    addTrustLine,
    loadAccount,
    migrateAccount,
    fetchUnlockTransaction,
    getLockedBalances,
    transferLockedTokens,
} from '@jimber/stellar-crypto';
import { mnemonicToEntropy } from 'bip39';
import moment from 'moment';
import { Server } from 'stellar-sdk';
import config from '../../public/config';
import store from '../store';
import Logger from 'js-logger';

export const mapAccount = async ({
    accountResponse,
    name,
    tags,
    index,
    position,
    seed,
    keyPair,
    seedPhrase,
    lockedTransactions,
    lockedBalances,
    isConverted
}) => ({
    name: name,
    tags: tags,
    id: accountResponse.id,
    balances: accountResponse.balances.filter(b=> {
        const currencies = Object.keys(config.currencies)
        return currencies.includes(b.asset_code)
        }).sort((b, a) => {
        if (a.asset_code < b.asset_code) {
            return -1;
        }
        if (a.asset_code > b.asset_code) {
            return 1;
        }
        return 0;
    }),
    index,
    position,
    seed,
    keyPair,
    seedPhrase,
    lockedTransactions: lockedTransactions.sort((a, b) => {
        if (!a.unlockTransaction) {
            return 0;
        }
        if (!b.unlockTransaction) {
            return 0;
        }
        if (
            a.unlockTransaction.timeBounds.minTime <
            b.unlockTransaction.timeBounds.minTime
        ) {
            return -1;
        }
        if (
            a.unlockTransaction.timeBounds.minTime >
            b.unlockTransaction.timeBounds.minTime
        ) {
            return 1;
        }
        return 0;
    }),
    lockedBalances,
    isConverted
});

// todo: make this an interval loop
// todo: upodate locked balance
// todo: remove converted escrow accounts
async function lockedTokenSubRoutine(lockedBalances) {
    const server = new Server(config.stellarServerUrl);
    for (const lockedBalance of lockedBalances) {
        const unlockHash = lockedBalance.unlockHash;
        if (unlockHash) {
            store.commit('setLoadingMessage', {
                message: 'fetching locked tokens',
            });
            try{
            lockedBalance.unlockTransaction = await fetchUnlockTransaction(
                unlockHash
                );
            }catch{
                Logger.info('failed to fetch unlock trans', unlockHash)
                continue
            }
            // const timestamp = moment.unix(lockedBalance.unlockTransaction.timeBounds.minTime).toString()
            // const isBeforeNow = moment.unix(lockedBalance.unlockTransaction.timeBounds.minTime).isBefore()
            // Logger.info('fetched unlocktransaction', {unlockHash, timestamp, isBeforeNow})
            if (
                !moment
                    .unix(lockedBalance.unlockTransaction.timeBounds.minTime)
                    .isBefore()
            ) {
                const mintimeTrans = lockedBalance.unlockTransaction.timeBounds.minTime;
                Logger.info('Lockedtransaction mintime is not before now ', {mintimeTrans})
                continue;
            }
            const unlockTrans = lockedBalance.unlockTransaction
            Logger.info('submitting unlocktransaction', {unlockTrans})
            await server.submitTransaction(lockedBalance.unlockTransaction);
            lockedBalance.unlockHash = null;
            lockedBalance.unlockTransaction = null;
        }

        // could be already changed to null
        if (!lockedBalance.unlockHash) {
            Logger.info('Locked balance unlockhash doesn\'t exist')
            console.log(lockedBalance);
            try{
                await transferLockedTokens(
                    lockedBalance.keyPair,
                    lockedBalance.id,
                    lockedBalance.balance.asset_code,
                    Number(lockedBalance.balance.balance)
                );
            } catch(e){
                const message = e.message
                console.log(message)
                Logger.error('Transferring locked tokens failed ', JSON.stringify(message))
            }
        }
    }
}

export const fetchAccount = async ({
    seedPhrase,
    index,
    name,
    tags,
    position,
    isConverted,
    retry = 0,
}) => {
    if (retry > 3) {
        console.error('too many retries');
        throw new Error('too many retries');
    }
    const entropy = calculateWalletEntropyFromAccount(seedPhrase, index);
    const keyPair = keypairFromAccount(entropy);
    let accountResponse;
    try {
        accountResponse = await loadAccount(keyPair);
    } catch (e) {
        Logger.error('error Something went wrong while fetching account', {e})

        if (e.message !== 'Not Found') {
            throw Error('Something went wrong while fetching account');
        }
        accountResponse = await generateAndFetchAccount(
            keyPair,
            seedPhrase,
            index
        );
    }

    const valid = await validateAndFixAccountResponse(accountResponse, keyPair);

    if (!valid) {
        return await fetchAccount({
            seedPhrase,
            index,
            name,
            tags,
            position,
            isConverted,
            retry: retry + 1,
        });
    }

    const lockedTransactions = await getLockedBalances(keyPair);
    lockedTokenSubRoutine(lockedTransactions);

    let lockedBalances = {};
    lockedTransactions.forEach(transaction => {
        if (lockedBalances[transaction.balance.asset_code]) {
            lockedBalances[transaction.balance.asset_code] += Number(
                transaction.balance.balance
            );
        } else {
            lockedBalances[transaction.balance.asset_code] = Number(
                transaction.balance.balance
            );
        }
    });

    return mapAccount({
        accountResponse,
        index,
        tags,
        name,
        position,
        seed: Buffer.from(mnemonicToEntropy(seedPhrase), 'hex'),
        keyPair,
        seedPhrase,
        lockedTransactions,
        lockedBalances,
        isConverted
    });
};

async function generateAndFetchAccount(keyPair, seedPhrase, index) {
    try {
        const revineAddress = revineAddressFromSeed(seedPhrase, index);
        // tfchain testnet is discontinued
        // Call friendbot to activate if not in prod
        if(config.env == "production"){
            await migrateAccount(keyPair, revineAddress);
        }
        else{
            const Http = new XMLHttpRequest();
            Http.open("GET", `https://friendbot.stellar.org/?addr=${keyPair.publicKey()}`,false);
            Http.send();
        }
        
    } catch (e) {
        Logger.error('error Something went wrong while generating account', {e})

        throw Error('Something went wrong while generating account');
    }
    console.log('loading account');
    return await loadAccount(keyPair);
}

const validateAndFixAccountResponse = async (accountResponse, keyPair) => {
    if (!accountResponse.balances.find(b => b.asset_code === 'TFT')) {
        await addTrustLine(keyPair);
        return false;
    }
    return true;
};

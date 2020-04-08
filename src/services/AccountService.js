import {
    calculateWalletEntropyFromAccount,
    keypairFromAccount,
    revineAddressFromSeed,
} from '@jimber/stellar-crypto/dist/service/cryptoService';
import {
    addTrustLine,
    loadAccount,
    migrateAccount,
} from '@jimber/stellar-crypto/dist/service/stellarService';
import { mnemonicToEntropy } from 'bip39';
import {
    fetchUnlockTransaction,
    getLockedBalances,
    transferLockedTokens,
} from '@jimber/stellar-crypto/dist/service/lockService';
import moment from 'moment';
import { Server } from 'stellar-sdk';
import config from '../../public/config';
import store from '../store';

export const mapAccount = async ({
    accountResponse,
    name,
    tags,
    index,
    position,
    seed,
    keyPair,
    seedPhrase,
    lockedBalances,
    lockedBalance,
}) => ({
    name: name,
    tags: tags,
    id: accountResponse.id,
    balances: accountResponse.balances,
    index,
    position,
    seed,
    keyPair,
    seedPhrase,
    lockedBalances,
    lockedBalance,
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
            lockedBalance.unlockTransaction = await fetchUnlockTransaction(
                unlockHash
            );
            if (
                !moment
                    .unix(lockedBalance.unlockTransaction.timeBounds.minTime)
                    .isBefore()
            ) {
                continue;
            }
            await server.submitTransaction(lockedBalance.unlockTransaction);
            lockedBalance.unlockHash = null;
            lockedBalance.unlockTransaction = null;
        }

        // could be already changed to null
        if (!lockedBalance.unlockHash ) {
            console.log(lockedBalance);
            await transferLockedTokens(
                lockedBalance.keyPair,
                lockedBalance.id,
                Number(lockedBalance.balance)
            );
        }
    }
}

export const fetchAccount = async ({
    seedPhrase,
    index,
    name,
    tags,
    position,
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
            retry: retry + 1,
        });
    }

    const lockedBalances = await getLockedBalances(keyPair);
    lockedTokenSubRoutine(lockedBalances);

    const lockedBalance = lockedBalances.reduce((total, lockedBalance) => {
        return total + Number(lockedBalance.balance);
    }, 0);

    return mapAccount({
        accountResponse,
        index,
        tags,
        name,
        position,
        seed: Buffer.from(mnemonicToEntropy(seedPhrase), 'hex'),
        keyPair,
        seedPhrase,
        lockedBalances,
        lockedBalance,
    });
};

async function generateAndFetchAccount(keyPair, seedPhrase, index) {
    try {
        const revineAddress = revineAddressFromSeed(seedPhrase, index);
        await migrateAccount(keyPair, revineAddress);
    } catch (e) {
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

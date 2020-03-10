import {
  keypairFromAccount,
  revineAddressFromSeed,
} from '@jimber/stellar-crypto/dist/service/cryptoService';
import {
  loadAccount,
  generateAccount,
} from '@jimber/stellar-crypto/dist/service/stellarService';
import { mnemonicToEntropy } from 'bip39';
import store from '../store';

export const mapAccount = async ({
  accountResponse,
  name,
  tags,
  index,
  position,
  seed,
  keyPair,
}) => ({
  name: name,
  tags: tags,
  id: accountResponse.id,
  balances: accountResponse.balances,
  index,
  position,
  seed,
  keyPair,
});

export const fetchAccount = async ({
  seedPhrase,
  index,
  name,
  tags,
  position,
}) => {
  const keyPair = keypairFromAccount(seedPhrase, index);
  console.log(seedPhrase);
  console.log(index);
  console.log(keyPair.publicKey());
  let accountResponse;
  try {
    accountResponse = await loadAccount(keyPair);
  } catch (e) {
    if (e.message !== 'Not Found') {
      throw Error('Something went wrong while fetching account');
    }
    accountResponse = await generateAndFetchAccount(keyPair, seedPhrase, index);
  }
  return mapAccount({
    accountResponse,
    index,
    tags,
    name,
    position,
    seed: Buffer.from(mnemonicToEntropy(seedPhrase), 'hex'),
    keyPair,
  });
};

async function generateAndFetchAccount(keyPair, seedPhrase, index) {
  try {
    const revineAddress = revineAddressFromSeed(seedPhrase, index);
    await generateAccount(keyPair, revineAddress);
  } catch (e) {
    throw Error('Something went wrong while generating account');
  }
  console.log('loading account');
  return await loadAcount(keyPair);
}

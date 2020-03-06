import { keypairFromAccount } from '@jimber/stellar-crypto/dist/service/cryptoService';
import {
  loadAccount,
  generateAccount,
} from '@jimber/stellar-crypto/dist/service/stellarService';
import { mnemonicToEntropy } from 'bip39';

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
    accountResponse = await generateAndFetchAccount(keyPair);
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

async function generateAndFetchAccount(keyPair) {
  try {
    await generateAccount(keyPair);
  } catch (e) {
    throw Error('Something went wrong while generating account');
  }
  return await loadAcount(keyPair);
}

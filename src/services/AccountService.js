import { keypairFromAccount } from "@jimber/stellar-crypto/dist/service/cryptoService";
import { loadAcount } from "@jimber/stellar-crypto/dist/service/stellarService";
import { mnemonicToEntropy } from "bip39";

export const mapAccount = async ({
  accountResponse,
  name,
  tags,
  index,
  position,
  seed
}) => ({
  name: name,
  tags: tags,
  id: accountResponse.id,
  balances: accountResponse.balances,
  transactions: await accountResponse.transactions(),
  index,
  position,
  seed
});

export const fetchAccount = async ({
  seedPhrase,
  index,
  name,
  tags,
  position
}) => {
  const keyPair = keypairFromAccount(seedPhrase, index);
  const accountResponse = await loadAcount(keyPair);
  return await mapAccount({
    accountResponse,
    index,
    tags,
    name,
    position,
    seed: Buffer.from(mnemonicToEntropy(seedPhrase), 'hex')
  });
};

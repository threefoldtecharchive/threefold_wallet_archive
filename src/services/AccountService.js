import { keypairFromAccount } from "@jimber/stellar-crypto/dist/service/cryptoService";
import { loadAcount } from "@jimber/stellar-crypto/dist/service/stellarService";

export const mapAccount = async ({ accountResponse, name, tags, index, position}) => ({
  name: name,
  tags: tags,
  id: accountResponse.id,
  balances: accountResponse.balances,
  transactions: await accountResponse.transactions(),
  index: index,
  postion: position
});

export const fetchAccount = async ({ seed, index, name, tags, position }) => {
  const keyPair = keypairFromAccount(seed, index);
  const accountResponse = await loadAcount(keyPair);
  return await mapAccount({
    accountResponse,
    index: index,
    tags: tags,
    name: name,
    position: position
  });
};

import store from '../store'

export const isImportedWallet = wallet => {
  const holder = wallet.holder
  if (holder.type !== 'imported') {
    return false
  }
  return true
}
export const canRemoveWallet = wallet => {
  return isImportedWallet(wallet)
}
export const canShowSeed = wallet => {
  return isImportedWallet(wallet)
}
export const walletNameFound = name => {
  return store.getters.wallets.find(x => x.name === name)
}
export const importedSeedFound = seed => {
  return store.getters.wallets.find(x => x.holder.seed.toString() === seed.toString())
}

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

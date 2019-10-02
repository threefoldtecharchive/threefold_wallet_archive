export default({
  tftNetwork: 'standard',
  gftNetwork: 'testnet',
  nbhFaucet: `https://faucet.testnet.nbh-digital.com/`,
  nbhExplorer: `https://explorer2.testnet.nbh-digital.com/explorer`,
  appId: `${window.location.host}`,
  botFrontEnd: 'https://login.threefold.me/',
  botBackend: 'https://login.threefold.me',
  redirect_url: '/login',
  scope: JSON.stringify({derivedSeed: true})
})

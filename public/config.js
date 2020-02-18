export default({
  tftNetwork: 'testnet',
  gftNetwork: 'testnet',
  nbhFaucet: 'https://faucet.testnet.nbh-digital.com/',
  nbhExplorer: 'https://explorer2.testnet.nbh-digital.com/explorer',
  appId: `${window.location.host}`,
  botFrontEnd: 'https://login.staging.jimber.org/',
  botBackend: 'https://login.staging.jimber.org',
  redirect_url: '/login',
  scope: JSON.stringify({ doubleName: true, derivedSeed: true }),
  pkidUrl: 'https://pkid.staging.jimber.org'
})
  
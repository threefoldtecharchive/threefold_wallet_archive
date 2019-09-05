export default({
  tftNetwork: 'testnet',
  gftNetwork: 'testnet',
  nbhFaucet: `https://faucet.testnet.nbh-digital.com/`,
  nbhExplorer: `https://explorer2.testnet.nbh-digital.com/explorer`,
  appId: `${window.location.host}`,
  botFrontEnd: 'http://192.168.2.60:8081/',
  botBackend: 'http://192.168.2.60:5000',
  redirect_url: '/login',
  scope: JSON.stringify({doubleName: true, keys: true})
})

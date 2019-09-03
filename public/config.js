export default({
  tftNetwork: 'testnet',
  appId: `${window.location.host}`,
  botFrontEnd: 'http://192.168.2.120:8081/',
  botBackend: 'http://192.168.2.120:5000',
  redirect_url: '/login',
  scope: JSON.stringify({doubleName: true, keys: true})
})

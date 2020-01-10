import walletSelector from '../../components/walletSelector'
import { EventBus } from '../../eventBus.js'
import FormComponent from './components/formComponent'
import TransactionInfoDialog from './components/transactionInfoDialog'
import QrScannerDialog from './components/qrScannerDialog'
import QrDialog from './components/qrDialog'

import { mapGetters, mapActions } from 'vuex'
import store from '../../store'
export default {
  name: 'transfer',
  components: {
    walletSelector,
    FormComponent,
    TransactionInfoDialog,
    QrScannerDialog,
    QrDialog
  },
  data () {
    return {
      transactionInfoDialog: false,
      qrScannerDialog: false,
      qrDialog: false,
      formObject: { to: { address: null }, amount: null, message: "", sender: null },
      selectedTab: 1,
      selectedWallet: {},
      qrReadingError: false
    }
  },
  mounted () {
    EventBus.$on('transfer', () => {
      this.transferConfirmed()
    })
    if(this.$route.params.wallet){
      this.selectedWallet = this.wallets.find(x => x.name === this.$route.params.wallet)
    }
    this.$router.replace({ query: { tab: this.tabs[this.tabs.length - 1] } })
    if (!this.selectedWallet.address) this.selectedWallet = this.computedWallets[0]
  },
  beforeDestroy () {
    EventBus.$off('transfer')
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
    tabs () {
      if (this.$route.name === 'transfer') return ['receive', 'send']
      else if (this.$route.name === 'transfer investments') return ['deregister', 'register']
      else return []
    },
    active () {
      return this.$route.query.tab
    },
    investments () {
      if (this.$route.name === 'transfer investments') return true
      return false
    },
    computedWallets () {
      if (this.$route.name === 'transfer investments' && this.$route.query.tab != 'deregister') {
        return this.wallets.filter(x => x.currency === 'gram')
      } else if (this.$route.name === 'transfer investments') {
        return this.wallets.filter(x => x.currency === 'GFT')
      }
      return this.wallets.filter(x => x.currency === 'GFT' || x.currency === 'TFT')
    },
    fee () {
      return 0.1
    },
    walletDisplay (wallet) {
      console.log(`thx ifvan `, wallet)
    }
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    scanQR () {
      window.vueInstance = this //Don't remove this for flutter app
      const self = this
      window.flutter_inappwebview.callHandler('SCAN_QR').then(function (result) {
        self.onDecode(result)
      })
      // Print.postMessage(JSON.stringify(postMsg))
    },
    onDecode (code) {
      var url = new URL(code)

      
      var tftAddress = url.hostname
      
      if (tftAddress === '') {
        tftAddress = url.pathname.replace('//', '')
      }
      this.formObject.to.address = tftAddress
      this.formObject.amount = url.searchParams.get('amount') == null ? '' : url.searchParams.get('amount');
      this.formObject.message = url.searchParams.get('message') == null ? '' : url.searchParams.get('message');
      this.formObject.sender = url.searchParams.get('sender') == null ? '' : url.searchParams.get('sender');

      // console.log(code)
      // code = code.replace('tft:', 'tft://')

      // this.formObject.to.address = this.getQueryVar(code, 'HOST')
      // this.formObject.amount = this.getQueryVar(code, 'amount')
      // this.formObject.message = this.getQueryVar(code, 'message')
      // this.formObject.sender = this.getQueryVar(code, 'sender')
    },
    getQueryVar (url, varName) {
      var val
      url = new URL(url)
      if (varName === 'HOST') {
        val = url.pathname.replace('//', '')
      } else {
        val = url.searchParams.get(varName)
      }
      return val
    },
    transferConfirmed () {
      if (this.active === 'receive') {
        if (this.checkForm()) this.qrDialog = true
      } else if (this.active == 'send' || this.active == 'register' || this.active == 'deregister') {
        if (this.checkForm()) this.transactionInfoDialog = true
      }
    },
    async send () {
      // This is temporary untill the atomic exchange
      if (this.selectedWallet.currency === 'TFT') {
        this.formObject.to.currency = this.selectedWallet.currency
      }
      console.log({
        from: this.selectedWallet.address,
        to: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount,
        currency: this.selectedWallet.currency,
        type: `${this.selectedWallet.currency}/${this.formObject.to.currency}` })

      await this.sendCoins({
        from: this.selectedWallet.address,
        to: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount,
        currency: this.selectedWallet.currency,
        type: `${this.selectedWallet.currency}/${this.formObject.to.currency}`
      })

      this.formObject = { to: { address: null }, amount: null, message: null, sender: null }
      this.$refs.formComponent.$refs.form.reset()
      setTimeout(function () { store.dispatch('updateAccounts') }, 1000)
      console.log(this.$route)
      this.$router.push({ name: this.$route.meta.history, params: { wallet: this.selectedWallet.name } })
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
      this.formObject = { to: { address: null }, amount: null, message: null, sender: null }
      this.$refs.formComponent.$refs.form.reset()
    },
    checkForm () {
      return this.$refs.formComponent.$refs.form.validate()
    },
    formValidation (valid) {
      EventBus.$emit('transferDisabled', !valid)
    },
    closeTransactionInfoDialog (save) {
      if (save) this.send()
      this.transactionInfoDialog = false
    },
    closeQrScannerDialog () {
      this.qrScannerDialog = false
    },
    closeQrDialog () {
      this.qrDialog = false
    }
  },
  watch: {
    '$route.query.tab' () {
      this.formObject = { to: { address: null }, amount: null, message: null, sender: null }
      this.$refs.formComponent.$refs.form.reset()
      
      this.$forceUpdate()
    }
  }
}

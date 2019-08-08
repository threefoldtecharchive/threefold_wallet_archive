import walletSelector from '../../components/walletSelector'
import { EventBus } from '../../eventBus.js'
import FormComponent from './components/formComponent'
import TransactionInfoDialog from './components/transactionInfoDialog'
import QrScannerDialog from './components/qrScannerDialog'
import QrDialog from './components/qrDialog'

import { mapGetters, mapActions } from 'vuex'
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
      formObject:{},
      selectedTab: 1,
      selectedWallet: {}
    }
  },
  mounted () {
    EventBus.$on('transfer', (payload) => {
      this.transferConfirmed()
    })
    if (!this.selectedWallet.address) this.selectedWallet = this.wallets[0]
    
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    transferConfirmed (val) {
      if(this.selectedTab == 0) {
        console.log("show QR")
        if (this.checkForm()) this.qrDialog = true
      } else if (this.selectedTab == 1) {
        console.log("send money")
        if (this.checkForm()) this.send()
      }
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
    },
    send () {
      this.sendCoins({
        from: this.selectedWallet.address,
        to: this.formObject.to,
        message: this.formObject.message,
        amount: this.formObject.amount
      })
      this.formObject = {}
      this.$refs.formComponent.$refs.form.reset()
    },
    onDecode (code) {
      code = code.replace('tft:', 'tft://')
      this.formObject.to = this.getQueryVar(code, 'HOST')
      this.formObject.amount = this.getQueryVar(code, 'amount')
      this.formObject.message = this.getQueryVar(code, 'message')
      this.formObject.sender = this.getQueryVar(code, 'sender')
      this.transactionInfoDialog = true
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
    checkForm() {
      return this.$refs.formComponent.$refs.form.validate()
    },
    formValidation (valid) {
      EventBus.$emit('transferDisabled', !valid)
    },
    closeTransactionInfoDialog (save) {
      this.transactionInfoDialog = false
    },
    closeQrScannerDialog (save) {
      this.qrScannerDialog = false
    },
    closeQrDialog (save) {
      this.qrDialog = false
    }
  },
  watch: {
    selectedTab (val) {
      this.selectedWallet = this.wallets[0]
      this.formObject = {}
      this.$refs.formComponent.$refs.form.resetValidation()
    },
    wallets: {
      handler () {
        this.$refs.formComponent.$refs.form.validate()
      },
      deep: true
    }
  }
}

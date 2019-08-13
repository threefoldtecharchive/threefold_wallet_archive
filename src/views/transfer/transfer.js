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
      formObject:{to:{}},
      selectedTab: 1,
      selectedWallet: {}
    }
  },
  mounted () {
    EventBus.$on('transfer', (payload) => {
      this.transferConfirmed()
    })
    if (!this.selectedWallet.address) this.selectedWallet = this.computedWallets[0]
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
    investments () {
      if (this.$route.name === 'transfer investments') return true
      return false
    },
    computedWallets () {
      if (this.$route.name === 'transfer investments') return this.wallets.filter(x => x.currency === 'gram')
      return this.wallets.filter(x => x.currency === 'GFT' || x.currency === 'TFT')
    }
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    transferConfirmed (val) {
      if(this.selectedTab == 0) {
        if (this.checkForm()) this.qrDialog = true
      } else if (this.selectedTab == 1) {
        if (this.checkForm()) this.send()
      }
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
    },
    send () {
      this.sendCoins({
        from: this.selectedWallet.address,
        to: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount,
        currency: this.selectedWallet.currency
      })
      this.formObject = {to:{}}
      this.$refs.formComponent.$refs.form.reset()
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
      this.formObject = {to:{}}
      this.$refs.formComponent.$refs.form.resetValidation()
    }
  }
}

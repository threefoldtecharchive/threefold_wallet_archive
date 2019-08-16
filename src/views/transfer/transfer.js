import walletSelector from '../../components/walletSelector'
import { EventBus } from '../../eventBus.js'
import FormComponent from './components/formComponent'
import TransactionInfoDialog from './components/transactionInfoDialog'
import QrScannerDialog from './components/qrScannerDialog'
import QrDialog from './components/qrDialog'
import {cloneDeep} from 'lodash'

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
    this.$router.replace({query: {tab: this.tabs[this.tabs.length - 1]}})
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
      else if (this.$route.name === 'transfer investments') return ['register', 'deregister']
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
      if (this.$route.name === 'transfer investments' && this.$route.query.tab != 'register') return this.wallets.filter(x => x.currency === 'gram')
      else if (this.$route.name === 'transfer investments') return this.wallets.filter(x => x.currency === 'GFT')
      return this.wallets.filter(x => x.currency === 'GFT' || x.currency === 'TFT')
    }
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    transferConfirmed (val) {
      if(this.active == 'receive') {
        if (this.checkForm()) this.qrDialog = true
      } else if (this.active == 'send' || this.active == 'deregister' || this.active == 'register') {
        if (this.checkForm()) this.send()
      }
    },
    send () {
      this.sendCoins({
        from: this.selectedWallet.address,
        to: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount,
        currency: this.selectedWallet.currency,
        type: `${this.selectedWallet.currency}/${this.wallets.find( x => x.address == this.formObject.to.address).currency}`
      })
      this.formObject = {to:{}}
      this.$refs.formComponent.$refs.form.reset()
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
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
    '$route.query.tab' (val) {
      this.selectedWallet = this.computedWallets[0]
      this.formObject = {to:{}}
      this.$refs.formComponent.$refs.form.resetValidation()
    }
  }
}

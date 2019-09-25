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
      formObject: { to: {} },
      selectedTab: 1,
      selectedWallet: {}
    }
  },
  mounted () {
    EventBus.$on('transfer', () => {
      this.transactionInfoDialog = true
      this.transferConfirmed()
    })
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
    }
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    transferConfirmed () {
      if (this.active == 'receive') {
        if (this.checkForm()) this.qrDialog = true
      } else if (this.active == 'send' || this.active == 'register' || this.active == 'deregister') {
        if (this.checkForm()) this.transactionInfoDialog = true
      }
    },
    async send () {
      console.log(this.selectedWallet.currency, this.formObject.to.currency)
      // This is temporary untill the atomic exchange
      if (this.selectedWallet.currency === 'TFT') {
        this.formObject.to.currency = this.selectedWallet.currency
      }
      await this.sendCoins({
        from: this.selectedWallet.address,
        to: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount,
        currency: this.selectedWallet.currency,
        type: `${this.selectedWallet.currency}/${this.formObject.to.currency}`
      })
      this.formObject = { to: {} }
      this.$refs.formComponent.$refs.form.reset()
      setTimeout(function () { store.dispatch('updateAccounts') }, 1000)
      this.$router.push({ name: this.$route.meta.history, params: { wallet: this.selectedWallet.name } })
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
      this.formObject = { to: {} }
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
      this.formObject = { to: {} }
      this.$refs.formComponent.$refs.form.reset()
      this.selectedWallet = this.computedWallets[0]
      this.$forceUpdate()
    }
  }
}

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
      formObject:{},
      transactionInfoDialog: false,
      qrScannerDialog: false,
      qrDialog: false,

      selectedTab: 1,
      selectedWallet: {},
      isLoading: false,
      entries: [],
      model: null,
      search: null,
      sender: {},
      transaction: {},
      transactionSent: false,
    }
  },
  computed: {
    ...mapGetters([
      'wallets',
      'transactionSubmitted'
    ]),
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map(entry => {
        const email = entry.email.length > this.descriptionLimit
          ? entry.email.slice(0, this.descriptionLimit) + '...'
          : entry.email

        return Object.assign({}, entry, { email })
      })
    }
  },
  mounted () {
    EventBus.$on('transfer', (payload) => {
      this.transferConfirmed()
    })
    if (!this.selectedWallet.address) this.selectedWallet = this.wallets[0]
    
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    transferConfirmed (val) {
      console.log('floating action button')
      if(this.selectedTab == 0) {
        console.log("show QR")
        if (this.$refs.formComponent.$refs.form.validate()) this.qrDialog = true
      } else if (this.selectedTab == 1) {
        console.log("send money")
        this.send ()
      }
    },
    selectWallet (wallet) {
      this.selectedWallet = wallet
    },
    send () {
      if (this.checkForm()) {
        this.sendCoins({
          from: this.selectedWallet.address,
          to: this.formObject.to,
          message: this.formObject.message,
          amount: this.formObject.amount
        })
        this.transactionSent = true
        this.formObject = {}
        this.$refs.formComponent.$refs.form.reset()
      }
    },
    onDecode (code) {
      code = code.replace('tft:', 'tft://')
      this.formObject.to = this.getQueryVar(code, 'HOST')
      this.formObject.amount = this.getQueryVar(code, 'amount')
      this.formObject.message = this.getQueryVar(code, 'message')
      this.formObject.sender = this.getQueryVar(code, 'sender')
      this.formObject.transactionInfoDialog = true
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
    }
  }
}

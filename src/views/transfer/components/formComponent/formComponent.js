import ToDialog from './components/toDialog'
import walletSelector from '../../../../components/walletSelector'

export default {
  name: 'form-component',
  components: {
    ToDialog,
    walletSelector
  },
  props: {
    formObject: {
      type: Object,
      default: () => {}
    },
    selectedTab: {
      type: Number
    },
    wallets: {
      type: Array,
      default: () => []
    },
    selectedWallet: {
      type: Object,
      default: () => {}
    },
    investments: {
      type: Boolean
    },
    fee: {
      type: Number
    }
  },
  data () {
    return {
      maxMessageLength: 10,
      toRules: [
        v => !!v || 'Wallet address is required!',
        v => (!!v && v.length >= 78 && v.length <= 78) || 'Wallet address length is not valid!',
      ],
      toDialog: false,
      valid: false,
      tooltip: false
    }
  },
  computed: {
    computedWallets () {
      if (this.$route.query.tab != 'deregister') return this.wallets.filter(x => x.currency == 'GFT')
      else return this.wallets.filter(x => x.currency === 'gram')
    },
    messageRules() {
      let rules = [
        v => ( typeof v == 'undefined' || (typeof v === 'string' && v.length <= this.maxMessageLength)) || `Message cannot be more than ${this.maxMessageLength} characters long`,
      ]
      return rules
    },
    amountRules() {
      let rules = [
        v => !!v || 'The amount is required',
        v => !!v && Number(v) > 0 || 'The amount must be greater than 0'
      ]
      if (['send', 'deregister', 'register'].some(x => x === this.$route.query.tab)) {
        rules.push(v => !!v && Number(v) <= Number((this.wallets.find(x => x.address == this.selectedWallet.address).totalAmount.replace(",", "") - 0.10).toFixed(9)) || 'Your balance is insufficient')
      }
      return rules
    },
    exchangeRate () {
      if (this.formObject.to.currency) return `1 ${this.selectedWallet.currency} = 1 ${this.formObject.to.currency}`
      return ''
    },
    yourExchangeRate () {
      if (this.formObject.to.currency && this.formObject.amount) {
        return `${this.formObject.amount} ${this.selectedWallet.currency} = ${(parseFloat(this.formObject.amount) - this.fee).toFixed(2)} ${this.formObject.to.currency}`
      }
      return ''
    }
  },
  mounted () {

  },
  methods: {
    closetoDialog (save, wallet) {
      if (save) {
        this.formObject.to = wallet
      }
      this.toDialog = false
      this.$refs.toDialog.$refs.externForm.reset()
    },
    selectWallet (wallet) {
      this.formObject.to = {
        name: wallet.name,
        currency: wallet.currency,
        address: wallet.address,
        holder: wallet.holder,
        totalAmount: wallet.totalAmount
      }
    }
  }
}

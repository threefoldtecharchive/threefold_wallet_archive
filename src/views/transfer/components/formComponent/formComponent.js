import { stringify } from "querystring";
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
    }
  },
  data () {
    return {
      maxMessageLength: 32,
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
      if (this.$route.query.tab != 'register') return this.wallets.filter(x => x.currency == 'GFT')
      else return this.wallets.filter(x => x.currency === 'gram')
    },
    messageRuless() {
      let rules = [
        v => ( typeof v == 'undefined' || (typeof v === 'string' && v.length <= this.maxMessageLength)) || `Message cannot be more than ${this.maxMessageLength} characters long`,
      ]
      return rules
    },
    amountRules() {
      let rules = [
        v => !!v || 'Amount is required',
        v => !!v && parseFloat(v.replace(',', '')) > 0 || 'Amount must be greater than 0',
      ]
      if (this.selectedTab === 1) rules.push(v => !!v && (this.selectedTab == 1) && parseFloat(v) <= parseFloat(this.wallets.find(x => x.address == this.selectedWallet.address).totalAmount.replace(',', '')) || 'Amount must be smaller than wallet value')
      return rules
    }
  },
  mounted () {

  },
  methods: {
    closetoDialog (save, address) {
      if (save) {
        this.formObject.to.address = address
      }
      this.toDialog = false
      this.$refs.toDialog.$refs.externForm.reset()
    },
    selectWallet (wallet) {
      this.formObject.to = wallet
    }
  }
}

import walletSelector from '../../../../components/walletSelector'
import walletCard from '../../../../components/walletCard'
export default {
  name: 'transaction-info-dialog',
  components: {walletSelector, walletCard},
  props: [],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function
    },
    send: {
      type: Function
    },
    selectedTab: {
      type: Number
    },
    selectWallet: {
      type: Function
    },
    wallets: {
      type: Array,
      default: () =>[]
    },
    selectedWallet: {
      type: Object,
      default: () => {}
    },
    formObject: {
      type: Object,
      default: () => {}
    },
    fee: {
      type: Number
    }
  },
  computed: {
    amount () {
      if (this.$route.query.tab == 'receive') return parseFloat(this.formObject.amount)
      return parseFloat(this.formObject.amount) - this.fee
    }
  }
}

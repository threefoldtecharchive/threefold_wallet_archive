import WalletCard from '../../../../../../components/walletCard'
export default {
  name: 'to-dialog',
  components: {
    WalletCard
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function
    },
    wallets: {
      type: Array
    },
    toRules: {
      type: Array
    },
    selectedWallet: {
      type: Object
    }
  },
  data () {
    return {
      selected: 0,
      externAddress: '',
      tabs: [
        {name:'Own wallets', value:0}, 
        {name:'Others',value:1}
      ],
      valid: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    selectWallet (wallet) {
      this.closeDialog(true, {
        address: wallet.address, 
        currency: wallet.currency, 
        holder: wallet.holder, 
        name: wallet.name, 
        totalAmount: wallet.totalAmount
      })
      this.$refs.externForm.reset()
      setTimeout(() => {
        this.selected = 0
      },1000)
    }
  },
  watch: {
    selected () {
      this.$refs.externForm.resetValidation()
    }
  }
}

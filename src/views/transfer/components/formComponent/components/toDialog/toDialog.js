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
    }
  },
  data () {
    return {
      selected: 0,
      externAddress: '',
      tabs: [{name:'Intern', value:0}, {name:'Extern',value:1}], // , {name:'Fiat',value:2}
      valid: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    selectWallet (address) {
      this.closeDialog(true, address)
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

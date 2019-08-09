import walletSelector from '../../../../components/walletSelector'
export default {
  name: 'transaction-info-dialog',
  components: {walletSelector},
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
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    
  },
  methods: {

  }
}

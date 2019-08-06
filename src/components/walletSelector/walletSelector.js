import walletCard from '../walletCard'
export default {
  name: 'wallet-selector',
  components: { walletCard },
  props: {
    wallets: {
      type: Array
    },
    selected: {
      type: String
    },
    noClip: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    console.log(`selected`, this.selected)
  },
  methods: {

  }
}

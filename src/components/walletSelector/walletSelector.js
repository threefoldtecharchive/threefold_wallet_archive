import walletCard from '../../components/walletCard'
export default {
  name: 'wallet-selector',
  components: { walletCard },
  props: [
    'wallets',
    'selected',
    // horizontal: {
    //   type: Boolean,
    //   default: true
    // }
  ],
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

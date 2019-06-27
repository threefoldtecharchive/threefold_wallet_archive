import walletSelector from '../../components/walletSelector'
import historyCard from '../../components/historyCard'
import { mapGetters } from 'vuex'
export default {
  name: 'history',
  components: { walletSelector, historyCard },
  props: [],
  data () {
    return {
      transactions: []
    }
  },
  computed: {
    ...mapGetters([
      'wallets'
    ])
  },
  mounted () {
    console.log(this.wallets.find(x => x.name === this.$route.params.wallet).transaction)
  },
  methods: {
    selectWallet (wallet) {
      this.$router.push({
        name: 'history',
        params: {
          wallet: wallet.name
        }
      })
    }
  }
}

import walletSelector from '../../components/walletSelector'
import historyCard from '../../components/historyCard'
import { mapGetters } from 'vuex'
import { groupBy } from 'lodash'

export default {
  name: 'history',
  components: { walletSelector, historyCard },
  props: [],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
    computedWallets () {
      if (this.$route.name == 'investments history') return this.wallets.filter(x => x.currency == 'gram')
      return this.wallets.filter(x => x.currency != 'gram')
    },
    groupedTransactions () {
      var transactions = this.wallets.find(x => x.name === this.$route.params.wallet).transaction
      var groupedTransactions = groupBy(transactions, x => {
        var date = new Date(0)
        date.setUTCSeconds(x.timestamp)
        return date.toLocaleDateString()
      })
      return groupedTransactions
    }
  },
  mounted () {
  },
  methods: {
    selectWallet (wallet) {
      this.$router.push({
        name: this.$route.name,
        params: {
          wallet: wallet.name
        }
      })
    },
    getMonth (date) {
      const options = { month: 'short' }
      date = Date.parse(date)
      return new Intl.DateTimeFormat('en-US', options).format(date)
    },
    getDay (date) {
      date = Date.parse(date)
      return date.getDate()
    },
    getDayName (date) {
      const options = { weekday: 'short' }
      date = Date.parse(date)
      return new Intl.DateTimeFormat('en-US', options).format(date)
    }
  }
}

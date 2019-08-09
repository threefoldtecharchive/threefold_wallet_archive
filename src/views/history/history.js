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
    groupedTransactions () {
      var transactions = this.wallets.find(x => x.name === this.$route.params.wallet).transaction
      var groupedTransactions = groupBy(transactions, x => {var date
        if (x.timestamp == null || x.timestamp == '-1') {
          date = new Date()
        } else {
          date = new Date(0)
          date.setUTCSeconds(x.timestamp)
        }
        return date.toDateString()
      })
      return groupedTransactions
    }
  },
  mounted () {
  },
  methods: {
    selectWallet (wallet) {
      this.$router.push({
        name: 'history',
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

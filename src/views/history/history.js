import walletSelector from '../../components/walletSelector'
import historyCard from '../../components/historyCard'
import walletCard from '../../components/walletCard'
import historyCardLocked from '../../components/historyCardLocked'
import { mapGetters } from 'vuex'
import { groupBy } from 'lodash'
import moment from 'moment'
export default {
  name: 'history',
  components: { walletSelector, walletCard, historyCard, historyCardLocked },
  props: [],
  data () {
    return {
      tabs: ['transactions', 'locked'],
      currentTab: 'transactions'
    }
  },
  computed: {
    ...mapGetters([
      'wallets',
      'hasLocked'
    ]),
    computedWallets () {
      if (this.$route.name == 'investments history') return this.wallets.filter(x => x.currency == 'gram')
      return this.wallets.filter(x => x.currency != 'gram')
    },
    groupedTransactions () {
      var transactions = this.wallets.find(x => x.name === this.$route.params.wallet).transaction
      var groupedTransactions = groupBy(transactions, x => {
        var date = null
        if (x.timestamp == null || x.timestamp == '-1') {
          date = new Date()
        } else {
          date = new Date(0)
          date.setUTCSeconds(x.timestamp)
        }
        return date.toDateString()
      })
      return groupedTransactions
    },
    lockedTransactions () {
      var transactions = this.wallets.find(x => x.name === this.$route.params.wallet).transaction
      // transactions = transactions.filter((x => x.inputs && x.inputs.length > 0) || (x => x.outputs && x.outputs.length > 0))
      return transactions
    },
    selectedWallet () {
      const selectedWallet = this.wallets.find(x => x.name === this.$route.params.wallet)
      return selectedWallet
    }
  },
  mounted () {
    // this.$refs.selector.$children.find(x => x.selected).$el.scrollIntoView({behavior: "auto", block: "center", inline: "center"})
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
      date = this.parseDate(date)
      const options = { month: 'short' }
      return new Intl.DateTimeFormat('en-US', options).format(date)
    },
    getDay (date) {
      date = this.parseDate(date)
      return date.getDate()
    },
    getDayName (date) {
      date = this.parseDate(date)
      const options = { weekday: 'short' }
      return new Intl.DateTimeFormat('en-US', options).format(date)
    },
    parseDate (date) {
      if (Date.parse(date).getTime() - 60000 * Date.parse(date).getTimezoneOffset() == 0) {
        return new Date()
      } else {
        return Date.parse(date)
      }
    }
  }
}

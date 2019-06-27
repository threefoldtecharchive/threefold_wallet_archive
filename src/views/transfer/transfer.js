import walletSelector from '../../components/walletSelector'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'transfer',
  components: { walletSelector },
  props: [],
  data () {
    return {
      selectedTab: 1,
      selectedWallet: null,
      isLoading: false,
      entries: [],
      model: null,
      search: null,
      to: null,
      amount: null,
      message: null
    }
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
    fields () {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items () {
      console.log(this.entries)
      return this.entries.map(entry => {
        const email = entry.email.length > this.descriptionLimit
          ? entry.email.slice(0, this.descriptionLimit) + '...'
          : entry.email

        return Object.assign({}, entry, { email })
      })
    }
  },
  mounted () {
    if (!this.selectedWallet) this.selectedWallet = this.wallets[0].name
  },
  methods: {
    ...mapActions([
      'sendCoins'
    ]),
    selectWallet (wallet) {
      this.selectedWallet = wallet.name
    },
    send () {
      this.sendCoins({
        from: this.selectedWallet,
        to: this.to,
        message: this.message,
        amount: this.amount
      })
      this.to = ''
      this.message = ''
      this.amount = ''
    }
  }
}

import amountIndicator from '../amountIndicator'
import { mapGetters, mapActions } from 'vuex'
import copy from 'clipboard-copy'
export default {
  name: 'wallet-card',
  components: { amountIndicator },
  props: {
    'wallet': {
      type: Object
    },
    'clickable': {
      type: Boolean
    },
    'selected': {
      type: Boolean
    }
  },
  data () {
    return {
      amount: '---',
      authenticated: 'false'
    }
  },
  computed: {
    ...mapGetters([
      'accounts'
    ]),
    totalAmount () {
      return parseFloat(this.wallet.totalAmount.replace(',', '')).toLocaleString('nl-BE', { minimumFractionDigits: 2 })
    },
    getHumanWalletAddress () {
      // return `${this.wallet.name}@${this.account.account_name}`
      return `${this.wallet.name}@${this.wallet.holder.account_name}`
    },
  },
  mounted () {
    if (this.wallet.currency === "GFT"){
      this.wallet.isAuthenticated.then( v => {
        this.authenticated = v
      })
    }
  },
  methods: {
    ...mapActions([
      'setInformationMessage'
    ]),
    copyAddress () {
      copy(this.wallet.address)
      this.setInformationMessage(`Address has been copied to clipboard (${this.wallet.address.substring(0, 8)}...).`)
    }
  }
}

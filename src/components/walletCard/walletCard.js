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
    },
    'displayAttributes': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      amount: '---',
      authenticated: true
    }
  },
  computed: {
    ...mapGetters([
      'accounts'
    ]),
    totalAmount () {
      return Number(this.wallet.totalAmount.replace(/,/g, "")).toFixed(2)
    },
    getHumanWalletAddress () {
      // return `${this.wallet.name}@${this.account.account_name}`
      return `${this.wallet.name.replace(/\s/g,'')}@${this.wallet.holder.account_name.split(':')[1]}`
    },
    image () {
      let currency = this.wallet.currency.toLowerCase()
      if (currency == 'gram') return 'gram-image'
      if (currency == 'gft') return 'gft-image'
      if (currency == 'tft') return 'tft-image'
    }
  },
  mounted () {
    if (this.wallet.currency === "GFT" || this.wallet.currency == "gram"){
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
    },
    clicked () {
      if(this.clickable && this.authenticated) this.$emit('click', this.wallet)
    }
  },
}

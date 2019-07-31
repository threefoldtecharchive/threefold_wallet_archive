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
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ]),
    totalAmount () {
      return parseFloat(this.wallet.totalAmount.replace(',', '')).toLocaleString('nl-BE', { minimumFractionDigits: 2 })
    },
    walletaddress () {
      return `${this.wallet.name}@${this.account.account_name}`
    }
  },
  mounted () {
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

import { mapGetters } from 'vuex'
import cryptoService from '../../services/cryptoService'

export default {
  name: 'walletinfo',
  components: { },
  props: [],
  data () {
    return {
      wallet: null,
      walletNameErrors: []
    }
  },
  computed: {
    ...mapGetters([
      'wallets',
      'accounts'
    ]),
    seed () {
      let seed = this.wallet.holder.seed
      seed = cryptoService.generateMnemonicFromSeed(seed)
      console.log(`hello`,seed)
      return seed
    }
  },
  beforeMount () {
    this.wallet = this.wallets.find(x => x.name === this.$route.params.wallet)
    window.accounts = this.accounts
    window.wallets = this.wallets
  },
  methods: {
    changeName () {
      console.log(`in change name`)
      console.log(this.wallet.holder)
      console.log(this.wallet.walletIndex)
      console.log(this.wallet.name)
      try {
        this.wallet.holder.wallet_update(this.wallet.walletIndex, this.wallet.name, this.wallet.walletIndex, this.wallet.address.length)
      }
      catch (err) {
        const error = typeof err.__str__ === 'function' ? err.__str__() : err.toString()
        console.log(error)
      }
    }
  }
}

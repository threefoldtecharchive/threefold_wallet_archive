import { mapGetters, mapActions } from 'vuex'
import cryptoService from '../../services/cryptoService'
import deleteWalletDialog from '../../components/deleteWalletDialog'
import { canRemoveWallet, canShowSeed } from '../../services/walletManagmentService'

export default {
  name: 'walletinfo',
  components: { deleteWalletDialog },
  props: [],
  data () {
    return {
      wallet: null,
      walletName: null,
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
      console.log(`hello`, seed)
      return seed
    }
  },
  beforeMount () {
    this.wallet = this.wallets.find(x => x.name === this.$route.params.wallet)
    this.walletName = this.wallet.name
  },
  methods: {
    ...mapActions(['updateAccounts']),
    async changeName (context) {
      console.log(`in change name`)
      console.log(`wallet_index`, this.wallet.walletIndex)
      console.log(`wallet_name`, this.wallet.name)
      console.log(`start_index`, this.wallet.startIndex)
      console.log(`address_count`, this.wallet.address.length)
      this.walletName = this.walletName.trim()
      if (this.walletName.length > 15) {
        this.walletNameErrors.push('The length of the name should not exceed 15 characters.')
        return
      }
      if (!this.walletNameFound()) {
        console.log('not found')
        try {
          this.wallet.holder.wallet_update(
            this.wallet.walletIndex,
            this.walletName,
            this.wallet.startIndex,
            1
          )

          this.updateAccounts()
          this.$router.push({ name: 'home' })
        } catch (err) {
          const error =
            typeof err.__str__ === 'function' ? err.__str__() : err.toString()
          console.log(error)
        }
    }else{
      this.walletNameErrors.push('There is already a wallet with this name')
    } 

    },
    isDeletableWallet () {
      return canRemoveWallet(this.wallet)
    },
    canShowSeed () {
      return canShowSeed(this.wallet)
    },
    walletNameFound () {
      console.log(`wallet name found`)
      console.log(`walletname`, this.walletName)
      console.log(`wallets`, this.wallets)
      return this.wallets.find(x => x.name.toLowerCase() == this.walletName.toLowerCase())
    }
  }
}

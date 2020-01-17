import walletCard from '../../components/walletCard'
import { mapGetters } from 'vuex'
export default {
  name: 'investments',
  components: { walletCard },
  props: [],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'wallets'
    ])
  },
  mounted () {

  },
  methods: {
    seeDetails (wallet) {
      this.$router.push({
        name: 'investments details',
        params: {
          wallet: wallet.name
        }
      })
    }
  }
}

import { mapActions, mapGetters } from 'vuex'
import { decodeBase64 } from 'tweetnacl-util'
import * as tfchain from '../../services/tfchain/api'

export default {
  name: 'init',
  components: {},
  props: [],
  data () {
    return {
      errorMsg: ''
    }
  },
  computed: {
    ...mapGetters([
      'accounts'
    ])
  },
  mounted () {
    window.vueInstance = this
    window.tfchain = tfchain
    window.decodeBase64 = decodeBase64
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    startWallet (doubleName, seed, importedWallets, appWallets) {
      window.localStorage.setItem('appWallets', appWallets)
      window.localStorage.setItem('importedWallets', importedWallets)
      seed = new Uint8Array(
        decodeBase64(seed)
      )
      this.login({
        doubleName,
        seed
      })
    }
  },
  watch: {
  //   accounts (val) {
  //     if (val.length) {
  //       this.$router.push({ name: 'home' })
  //     }
  //   }
  }
}

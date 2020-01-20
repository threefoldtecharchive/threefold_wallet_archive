import { mapActions, mapGetters } from 'vuex'
import { decodeBase64 } from 'tweetnacl-util'
import * as tfchain from '../../services/tfchain/api'
import router from '../../router'

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
    async startWallet (doubleName, seed, importedWallets, appWallets) {
      window.localStorage.setItem('appWallets', appWallets)
      window.localStorage.setItem('importedWallets', importedWallets)
      seed = new Uint8Array(
        decodeBase64(seed)
      )
      await this.login({
        doubleName,
        seed
      })
      router.push({ name: 'home' })
    }
  }
}

import { mapActions, mapGetters } from 'vuex'
import { decodeBase64 } from 'tweetnacl-util'

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
  },
  methods: {
    ...mapActions([
      'login',
      'loadWallets'
    ]),
    startWallet (doubleName, seed, importedWallets, appWallets) {
      appWallets = JSON.parse(appWallets)
      importedWallets = JSON.parse(importedWallets)
      seed = new Uint8Array(
        decodeBase64(seed)
      )
      
      this.login({
        doubleName,
        seed
      })
      this.loadWallets(appWallets, importedWallets)
    }
  },
  watch: {
    accounts (val) {
      if (val.length) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}

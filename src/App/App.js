import toolbar from '../components/toolbar'
import bottomNav from '../components/bottomNav'
import createWalletDialog from '../components/createWallet'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    toolbar,
    bottomNav,
    createWalletDialog
  },
  mounted () {
    setInterval(() => {
      this.updateAccount()
    }, 30000)
  },
  data () {
    return {
      showCreateWalletDialog: false,
      hideSnackbarTimeout: 6000
    }
  },
  computed: {
    ...mapGetters([
      'informationMessage'
    ]),
    cssProps () {
      return {
        '--primary-color': this.$vuetify.theme.primary,
        '--accent-color': this.$vuetify.theme.accent
      }
    }
  },
  methods: {
    ...mapActions([
      'createWallet',
      'updateAccount',
      'setInformationMessage'
    ]),
    handleCTAClick (data) {
      if (this.$route.name === 'home') {
        this.showCreateWalletDialog = !this.showCreateWalletDialog
        if (data) this.createWallet(data)
      }
    }
  },
  watch: {
    informationMessage (val) {
      if (val) {
        setTimeout(() => {
          this.setInformationMessage('')
        }, this.hideSnackbarTimeout)
      }
    }
  }
}

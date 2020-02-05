import { mapGetters } from 'vuex'
export default {
  components: {
  },
  name: 'toolbar',
  props: [],
  data () {
    return {
      isScrolling: false
    }
  },
  computed: {
    ...mapGetters([
      'syncing',
      'accounts'
    ])
  },
  mounted () {

  },
  methods: {
    onScroll () {
      this.isScrolling = (window.pageYOffset ||
        document.documentElement.scrollTop || 0) > 50
    },
    // enableQrScannerDialog () {
    //   this.$emit("enableQrScannerDialog")
    // },
    seeAdd () {
      this.$router.push({
        name: 'addwallet'
      })
    },
    seeWalletInfo () {
      this.$router.push({
        name: 'walletinfo',
        params: {
          account: this.$route.params.account
        }
      })
    }
  }
}

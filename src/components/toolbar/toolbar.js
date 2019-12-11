import { mapGetters, mapActions } from 'vuex'
import InformationDialog from '../informationDialog'
export default {
  components: {
    InformationDialog
  },
  name: 'toolbar',
  props: [],
  data () {
    return {
      isScrolling: false,
      informationDialog: false
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
    closeInformationDialog () {
      this.informationDialog = false
    },
    onScroll () {
      this.isScrolling = (window.pageYOffset ||
        document.documentElement.scrollTop || 0) > 50
    },
    enableQrScannerDialog () {
      this.$emit("enableQrScannerDialog")
    }
  }
}

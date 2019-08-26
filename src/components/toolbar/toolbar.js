import { mapGetters } from 'vuex'
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
      'syncing'
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
    }
  }
}

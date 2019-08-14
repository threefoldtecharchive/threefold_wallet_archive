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
    }
  }
}

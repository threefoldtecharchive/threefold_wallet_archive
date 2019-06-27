import { mapGetters } from 'vuex'
export default {
  components: {},
  name: 'toolbar',
  props: [],
  data () {
    return {

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

  }
}

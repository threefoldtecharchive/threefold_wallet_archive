import { mapGetters, mapActions } from "vuex";

export default {
  name: 'bottom-nav',
  components: {},
  props: [],
  data () {
    return {
      bottomnav: 0
    }
  },
  computed: {
    ...mapGetters ([
      "floatingActionButton"
    ])
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      "setFab"
    ]),
    handleCta() {
      console.log(this.$route.name)
      if(this.$route.name === 'transfer') {
        this.setFab(true)
      } else {
        this.$router.push({name: 'transfer'})
      }
    }
  }
}

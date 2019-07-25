import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'login',
  components: {},
  props: [],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'account',
      'loginUrl'
    ]),
    isLoggingIn () {
      return Object.entries(this.$route.query).length === 0
    }
  },
  mounted () {
    if (this.isLoggingIn) {
      this.generateLoginUrl()
    } else {
      this.checkResponse(new URL(window.location.href))
    }
  },
  methods: {
    ...mapActions([
      'generateLoginUrl',
      'checkResponse'
    ])
  },
  watch: {
    account (val) {
      if (val) {
        this.$router.push({ name: 'home' })
      }
    },
    loginUrl (val) {
      if (val) {
        window.location.href = val
      }
    }
  }
}

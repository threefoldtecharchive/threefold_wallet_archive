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
      'loginUrl',
      'accounts'
    ]),
    isLoggingIn () {
      var currentUrl = window.location.href
      var hasQueries = Object.entries(new URL(currentUrl)).length === 0
      return hasQueries || currentUrl
    }
  },
  mounted () {
    console.log(this.isLoggingIn)
    if (!this.isLoggingIn) {
      const account = JSON.parse(window.localStorage.getItem('user'))
      if (account && account.doubleName && account.seed) {
        account.seed = new Uint8Array(Object.values(account.seed))
        this.login(account)
      } else {
        this.generateLoginUrl()
      }
    } else {
      this.checkResponse(new URL(window.location.href))
    }
  },
  methods: {
    ...mapActions([
      'generateLoginUrl',
      'checkResponse',
      'login'
    ])
  },
  watch: {
    accounts (val) {
      if (val.length) {
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

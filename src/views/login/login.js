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
      return Object.entries(this.$route.query).length === 0
    }
  },
  mounted () {
    if (this.isLoggingIn && window.location.href.indexOf('#') === -1) {
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

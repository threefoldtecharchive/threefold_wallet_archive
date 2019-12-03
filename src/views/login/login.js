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
      // TODO: Check if we have the correspondig data instead of only checking if we got something
      return Object.entries(window.location.search).length !== 0
    }
  },
  mounted () {
    console.log(this.isLoggingIn)
    if (!this.isLoggingIn) {
      const account = JSON.parse(window.localStorage.getItem('user'))
      if (account && account.doubleName && account.seed) {
        console.log(`Logging in from storage`)
        account.seed = new Uint8Array(Object.values(account.seed))
        this.login(account)
      } else {
        console.log(`Generating url`)
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

import { mapActions } from 'vuex'

export default {
  name: 'deleteWalletDialog',
  components: {},
  props: {
    wallet: {
      type: Object
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {},
  mounted () {},
  methods: {
    ...mapActions(['removePkidWallet']),

    async deleteWallet() {
      await this.removePkidWallet(this.wallet)
      this.dialog = false
      this.$router.push({ name: 'home' })
    }
  }
}

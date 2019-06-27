import { mapGetters, mapActions } from 'vuex'
import { TFAccount } from '../../services/tfchain_wrapper/TFAccount'
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
      'account'
    ])
  },
  mounted () {
    this.login({
      doubleName: 'ivan.3bot',
      seed: 'lemon vocal marriage flash soft address barely crazy swarm alert hire riot find know around pill denial labor join spice energy planet deliver dress'
    })
  },
  methods: {
    ...mapActions([
      'login',
      'createWallet'
    ])
  },
  watch: {
    account (val) {
      if (val) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}

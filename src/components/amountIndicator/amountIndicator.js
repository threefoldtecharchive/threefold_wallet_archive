import { mapGetters } from "vuex"

export default {
  name: 'amount-indicator',
  components: {},
  props: {
    small: {
      type: Boolean,
      default: false
    },
    amount: {
      type: String,
      default: null
    },
    locked: {
      String
    },
    valuta: {
      type: String
    },
    color: {
      type: String
    },
    align: {
      type: String,
      default: 'left'
    },
    unconfirmed: {
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      "hasLockedOrUnconfirmed"
    ])
  },
  mounted () {
    
  },
  methods: {
    

  }
}

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
    showTypeCurrency: {
      type: Boolean,
      default: false
    } 
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      "hasLocked"
    ])
  },
  mounted () {
    
  },
  methods: {
    

  }
}

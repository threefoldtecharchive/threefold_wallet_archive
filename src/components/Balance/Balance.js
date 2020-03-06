export default {
  name: 'amount-indicator',
  components: {},
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    balances: {
      type: Array,
    },
    valuta: {
      type: String,
    },
    color: {
      type: String,
    },
    align: {
      type: String,
      default: 'left',
    },
    humanReadable: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {};
  },
  computed: {
    hasMultipleBalances () {
      // @Todo detect locked and unconfirmed
      return false;
    },
    validBalances() {
      return this.balances.filter(b => b.asset_code === 'TFT' )
    }
  },
  mounted () {},
  methods: {},
};

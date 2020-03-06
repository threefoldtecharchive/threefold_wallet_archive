export default {
  name: 'error-screen',
  components: {},
  props: [],
  data () {
    return {
      reason: null,
      fix: null,
    };
  },
  computed: {
    showFix() {
      return this.$route.params.fix;
    },
  },
  mounted () {},
  methods: {},
  beforeMount () {
    this.reason = this.$route.params.reason;
    if(!this.reason){
      this.reason = "A fatal error occurred";
    }
    this.fix = this.$route.params.fix
  },
};

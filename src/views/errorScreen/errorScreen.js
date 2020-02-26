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
  computed: {},
  mounted () {},
  methods: {},
  beforeMount () {
    this.reason = this.$route.params.reason;
    this.fix = this.$route.params.fix;
  },
};

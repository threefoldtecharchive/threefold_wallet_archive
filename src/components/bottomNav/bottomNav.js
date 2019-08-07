import { mapGetters, mapActions } from "vuex";
import { EventBus } from '../../eventBus.js';
export default {
  name: 'bottom-nav',
  components: {},
  props: [],
  data () {
    return {
      bottomnav: 0,
    }
  },
  computed: {
    ...mapGetters ([
      "submitDisabled"
    ])
  },
  mounted () {
  },
  methods: {
    handleCta() {
      console.log(this.$route.name)
      if(this.$route.name === 'transfer') {
        EventBus.$emit('transfer', true)
      } else {
        this.$router.push({name: 'transfer'})
      }
    },
  },
}

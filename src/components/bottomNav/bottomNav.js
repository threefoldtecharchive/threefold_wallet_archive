import { mapGetters, mapActions } from "vuex";
import { EventBus } from '../../eventBus.js';
export default {
  name: 'bottom-nav',
  components: {},
  props: [],
  data () {
    return {
      bottomnav: 0,
      submitDisabled: true
    }
  },
  computed: {
  },
  mounted () {
    EventBus.$on('transferDisabled', (payload) => {
      this.submitDisabled = payload
    })
  },
  beforeDestroy () {
    EventBus.$off('transferDisabled')
  },
  methods: {
    handleCta() {
      if(this.$route.name === 'transfer'|| this.$route.name === 'transfer investments') {
        EventBus.$emit('transfer', true)
      } else {
        this.$router.push({name: this.$route.meta.transfer})
      }
    },
  },
}

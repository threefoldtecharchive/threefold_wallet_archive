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

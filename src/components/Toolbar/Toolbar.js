import { mapMutations } from 'vuex';
export default {
  components: {},
  name: 'Toolbar',
  props: [],
  data () {
    return {
    };
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['addDevClick']),
    seeAdd () {
      this.$router.push({
        name: 'addwallet',
      });
    }
  },
};

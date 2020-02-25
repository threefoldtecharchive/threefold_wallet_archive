import { mapMutations, mapGetters } from 'vuex';
export default {
  components: {},
  computed: {
    ...mapGetters(['loadingTitle', 'loadingSubTitle']),
  },
  methods: {
    ...mapMutations(['addDevClick']),
  },
};

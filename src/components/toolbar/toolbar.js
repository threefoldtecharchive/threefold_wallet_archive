import { mapGetters, mapMutations } from 'vuex';
import router from '../../router';
export default {
  components: {},
  name: 'toolbar',
  props: [],
  data() {
    return {
      isScrolling: false,
    };
  },
  computed: {
    ...mapGetters(['syncing', 'accounts', 'devClicks']),
  },
  mounted() {},
  methods: {
    ...mapMutations(['addDevClick']),
    onScroll() {
      this.isScrolling =
        (window.pageYOffset || document.documentElement.scrollTop || 0) > 50;
    },
    seeAdd() {
      this.$router.push({
        name: 'addwallet',
      });
    },
    seeWalletInfo() {
      this.$router.push({
        name: 'walletinfo',
        params: {
          account: this.$route.params.account,
        },
      });
    },
  },
};

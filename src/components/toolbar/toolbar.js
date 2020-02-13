import { mapGetters } from 'vuex';
import router from '../../router';
export default {
  components: {},
  name: 'toolbar',
  props: [],
  data() {
    return {
      isScrolling: false,
      devClicks: 0,
    };
  },
  computed: {
    ...mapGetters(['syncing', 'accounts']),
  },
  mounted() {},
  methods: {
    onScroll() {
      this.isScrolling =
        (window.pageYOffset || document.documentElement.scrollTop || 0) > 50;
    },
    devClick() {
      this.devClicks++;
      console.log(this.devClicks);
      if (this.devClicks >= 5) {
        this.devClicks = 0;
        router.push({ name: 'devView' });
      }
    },
    // enableQrScannerDialog () {
    //   this.$emit("enableQrScannerDialog")
    // },
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

import WalletCard from "../../components/WalletCard";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { WalletCard },
  props: [],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["wallets"])
  },
  mounted() {},
  methods: {
    seeDetails(wallet) {
      this.$router.push({
        name: "details",
        params: {
          wallet: wallet.name
        }
      });
    }
  }
};

import { mapGetters, mapActions } from "vuex";
import { decodeBase64 } from "tweetnacl-util";
import WalletCard from "../../components/WalletCard";

export default {
  name: "Home",
  components: { WalletCard },
  props: [],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["accounts"])
  },
  mounted() {
    let seed = "dZS/ZkLaiUPSw2e2ZC8iU0QbpbVsKypey7qWPxNIdUw=";
    seed = new Uint8Array(decodeBase64(seed));
    this.createAccount({
      seed: seed,
      index: 0,
      name: "test",
      type: "app"
    });
  },
  methods: {
    ...mapActions(["createAccount"]),
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

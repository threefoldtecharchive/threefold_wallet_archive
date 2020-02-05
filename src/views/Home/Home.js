import { mapGetters, mapActions } from "vuex";
import { decodeBase64 } from "tweetnacl-util";
import AccountCard from "../../components/AccountCard";

export default {
  name: "Home",
  components: { AccountCard },
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

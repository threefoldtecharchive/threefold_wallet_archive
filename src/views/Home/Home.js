import { mapActions, mapGetters } from "vuex";
import AccountCard from "../../components/AccountCard";

export default {
  name: "Home",
  components: { AccountCard },
  props: [],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["accounts", "isLoadingWallets"])
  },
  mounted() {},
  methods: {
    seeDetails: wallet => {
      this.$router.push({
        name: "details",
        params: {
          wallet: wallet.name
        }
      });
    }
  }
};

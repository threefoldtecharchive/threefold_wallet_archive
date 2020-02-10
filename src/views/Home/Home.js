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
    ...mapGetters([
      "accounts", 
      "isLoadingWallets"
    ]),
    sortedAccounts(){
      const sortedAccounts = [...this.accounts];
      sortedAccounts.sort( (account, otherAccount) => account.postition > otherAccount.postition)
      return sortedAccounts
    }
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

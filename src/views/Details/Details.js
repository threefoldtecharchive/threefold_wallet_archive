import AccountCard from '../../components/AccountCard';
import store from '../../store';
import router from '../../router';
import { mapActions } from 'vuex';


export default {
  name: 'Details',
  components: { AccountCard },
  props: [],
  data() {
    return { account: null };
  },
  computed: {},
    beforeMount(){
      const account = store.getters.accounts.find(
        x => x.name === this.$route.params.account
      );
      if (!account) {
        router.push({ name: 'home' });
        return;
      }
      this.account = account;
    },
  methods: {
    ...mapActions([
      "fetchTransactions"
    ])
  },
  mounted(){
    this.fetchTransactions(this.account.id)
  }
};

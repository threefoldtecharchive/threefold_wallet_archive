import { mapActions, mapGetters } from 'vuex';
import AccountCard from '../../components/AccountCard';
import draggable from 'vuedraggable';
import store from '../../store';

export default {
  name: 'Home',
  components: { AccountCard, draggable },
  props: [],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['isLoadingWallets', 'isAppLoading']),
    accounts: {
      get() {
        const sortedAccounts = [...store.getters.accounts];
        sortedAccounts.sort(
          (account, otherAccount) => account.position - otherAccount.position
        );
        return sortedAccounts;
      },
      set(value) {
        value.map((account, index) => {
          account.position = index;
        });
        store.commit('setAccounts', value);
        store.dispatch('syncAccounts');
      },
    },
  },
  mounted() {},
  methods: {
    ...mapActions(['syncAccounts']),
    seeDetails: account => {
      this.$router.push({
        name: 'details',
        params: {
          account: account.name,
        },
      });
    },
  },
};

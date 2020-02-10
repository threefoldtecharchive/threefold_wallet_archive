import AccountCard from '../../components/AccountCard';
import store from '../../store';
import router from '../../router';

export default {
  name: 'Details',
  components: {AccountCard},
  props: [],
  data() {
    return {account: null};
  },
  computed: {},
  mounted() {
    const account = store.getters.accounts.find(
        x => x.name === this.$route.params.account);
    if (!account) {
      router.push({name: 'home'});
      return;
    }
    this.account = account;
  },
  methods: {},
};

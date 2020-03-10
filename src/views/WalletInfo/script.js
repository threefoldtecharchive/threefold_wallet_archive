import { mapGetters, mapActions } from 'vuex';
import router from '../../router';

export default {
  name: 'WalletInfo',
  data() {
    return {
      account: null,
      name: null,
    };
  },
  computed: {
    ...mapGetters(['accounts']),
  },
  methods: {
    ...mapActions(['changeWalletName', 'deleteAccount']),
    change() {
      this.changeWalletName({ account: this.account, name: this.name });
      router.push({ name: 'home' });
    },
    async deleteWallet() {
      await this.deleteAccount(this.account);
      router.push({ name: 'home' });
    },
  },
  beforeMount() {
    const account = this.accounts.find(
      x => x.name === this.$route.params.account
    );
    if (!account) {
      router.push({ name: 'home' });
      return;
    }
    this.account = account;
    this.name = account.name;
  },
};

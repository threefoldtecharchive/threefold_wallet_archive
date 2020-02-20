import { mapGetters } from 'vuex';

export default {
  name: 'WalletInfo',
  props: {},
  computed: {
    ...mapGetters(['accounts']),
  },
  beforeMount () {
    this.wallet = this.accounts.find(x => x.id === this.$route.params.wallet);
  },
};

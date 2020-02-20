import { mapGetters, mapActions, mapMutations } from 'vuex';
import router from '../../router';

export default {
  name: 'DevView',
  components: {},
  props: [],
  data () {
    return {};
  },
  computed: {
    ...mapGetters([
      'accounts',
      'pkidApp',
      'pkidImported',
      'appSeedPhrase',
      'threeBotName',
    ]),
  },
  mounted () {},
  methods: {
    ...mapMutations(['removeAppAccount']),
    ...mapActions(['generateAppAccount', 'setPkidAppAccounts', 'syncAccounts']),
    createWallet () {
      this.generateAppAccount(
        `dev wallet #${Math.random()
          .toString(36)
          .substr(2, 5)}`
      );
    },
    async ResetAppWallets () {
      this.removeAppAccount();
      await this.setPkidAppAccounts([
        {
          walletName: 'daily',
          position: 0,
          index: 0,
        },
        {
          walletName: 'savings',
          position: 1,
          index: 1,
        },
        {
          walletName: 'extra',
          position: 2,
          index: 2,
        },
      ]);
      await this.syncAccounts();
    },
  },
};

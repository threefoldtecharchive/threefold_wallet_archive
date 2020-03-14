import { mapGetters, mapActions, mapMutations } from 'vuex';
import router from '../../router';

export default {
  name: 'DevView',
  components: {},
  props: [],
  data() {
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
  mounted() {
  },
  methods: {
    ...mapMutations(['removeAppAccounts', 'removeImportedAccounts']),
    ...mapActions(['generateAppAccount', 'setPkidAppAccounts', 'setPkidImportedAccounts', 'syncAccounts']),
    Restart() {
      location.reload();
    },
    createWallet() {
      this.generateAppAccount(
        `dev wallet #${Math.random()
          .toString(36)
          .substr(2, 5)}`,
      );
    },
    async ResetAppWallets() {
      this.removeAppAccounts();
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
      ]);
      await this.syncAccounts();
    },
    async RemoveImportedAccounts() {
      await this.setPkidImportedAccounts([]);
      await this.syncAccounts();
    },
    errorScreen() {
      this.$router.push({
        name: 'error screen',
        params: {
          reason: 'conversion mistake',
          fix: 'close and reopen wallet',
        },
      });
    },
  },
};

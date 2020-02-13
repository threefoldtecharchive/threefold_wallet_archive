import toolbar from '../components/toolbar';
import bottomNav from '../components/bottomNav';
import copyDialog from '../components/copydialog';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'app',
  components: {
    toolbar,
    bottomNav,
    copyDialog,
  },
  mounted () {},
  data () {
    return {
      showCreateWalletDialog: false,
      showEditWalletDialog: false,
      hideSnackbarTimeout: 6000,
    };
  },
  computed: {
    ...mapGetters([
      'informationMessage',
      'fatalError',
      'isImportingWallet',
      'devClicks',
    ]),
    cssProps () {
      return {
        '--primary-color': this.$vuetify.theme.themes.light.primary,
        '--accent-color': this.$vuetify.theme.themes.light.accent,
        '--error-color': this.$vuetify.theme.themes.light.error,
        '--gold-color': this.$vuetify.theme.themes.light.gold,
        '--active-color': this.$vuetify.theme[this.$route.meta.accent],
      };
    },
  },
  methods: {
    ...mapActions([
      'createWallet',
      'setInformationMessage',
      'setImportingWallets',
    ]),
    ...mapMutations(['resetDevClicks']),
  },
  watch: {
    informationMessage (val) {
      if (val) {
        setTimeout(() => {
          this.setInformationMessage('');
        }, this.hideSnackbarTimeout);
      }
    },
    fatalError (val) {
      console.error(`ERROR`, val);
      this.$router.push({
        name: 'error',
        query: { msg: val },
      });
    },
    devClicks (val) {
      if (val < 5) {
        return;
      }
      this.$router.push({
        name: 'devview',
      });
    },
    $route (to, from) {
      this.resetDevClicks();
    },
  },
};

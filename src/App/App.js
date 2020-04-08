import Toolbar from '../components/Toolbar';
import BottomNavigation from '../components/BottomNavigation';
import CopyDialog from '../components/CopyDialog';
import Loader from '../components/Loader';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import config from '../../public/config';
import version from '../../public/version';

export default {
    name: 'app',
    components: {
        Toolbar,
        BottomNavigation,
        CopyDialog,
        Loader,
    },
    mounted() {},
    data() {
        return {
            showCreateWalletDialog: false,
            showEditWalletDialog: false,
            version: version,
        };
    },
    computed: {
        ...mapGetters(['isImportingWallet', 'devClicks', 'isAppLoading']),
        cssProps() {
            return {
                '--primary-color': this.$vuetify.theme.themes.light.primary,
                '--accent-color': this.$vuetify.theme.themes.light.accent,
                '--error-color': this.$vuetify.theme.themes.light.error,
                '--gold-color': this.$vuetify.theme.themes.light.gold,
                '--active-color': this.$vuetify.theme[this.$route.meta.accent],
            };
        },
        isProduction() {
            return config.isProduction;
        },
        env() {
            return config.env;
        },
        showLoader() {
            if (!this.isAppLoading) {
                return false;
            }
            if (
                this.$route.name === 'devview' ||
                this.$route.name === 'init' ||
                this.$route.name === 'sms' ||
                this.$route.name === 'error screen'
            ) {
                return false;
            }
            return true;
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
        informationMessage(val) {
            if (val) {
                setTimeout(() => {
                    this.setInformationMessage('');
                }, this.hideSnackbarTimeout);
            }
        },
        fatalError(val) {
            console.error(`ERROR`, val);
            this.$router.push({
                name: 'error',
                query: { msg: val },
            });
        },
        devClicks(val) {
            if (val < 5) {
                return;
            }
            this.$router.push({
                name: 'devview',
            });
        },
        $route(to, from) {
            this.resetDevClicks();
        },
    },
};

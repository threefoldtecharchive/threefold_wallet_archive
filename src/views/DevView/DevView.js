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
            'debugSeed',
        ]),
    },
    mounted() {},
    methods: {
        ...mapMutations(['removeAppAccounts', 'removeImportedAccounts']),
        ...mapActions([
            'generateAppAccount',
            'persistPkidAppAccounts',
            'persistPkidImportedAccounts',
            'syncAccounts',
        ]),
        Restart() {
            location.reload();
        },
        createWallet() {
            this.generateAppAccount(
                `dev wallet #${Math.random().toString(36).substr(2, 5)}`
            );
        },
        async ResetAppWallets() {
            this.removeAppAccounts();
            await this.persistPkidAppAccounts([]);
            await this.syncAccounts();
        },
        async RemoveImportedAccounts() {
            await this.persistPkidImportedAccounts([]);
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

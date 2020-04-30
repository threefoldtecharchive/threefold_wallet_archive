import { mapGetters, mapActions, mapMutations } from 'vuex';
import {
convertTokens,
revineAddressFromSeed
} from '@jimber/stellar-crypto';
import AddTrustlineCard from './components/AddTrustlineCard';
export default {
    name: 'DevView',
    components: { AddTrustlineCard },
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
            'currencies',
        ]),
    },
    mounted() {},
    methods: {
        ...mapMutations(['removeAppAccounts', 'removeImportedAccounts']),
        ...mapActions([
            'generateAppAccount',
            'persistPkidAppAccounts',
            'persistPkidImportedAccounts',
            'syncAccounts'
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
            await this.persistPkidAppAccounts([
                {
                    walletName: 'Daily',
                    position: 0,
                    index: 0,
                },
                {
                    walletName: 'Staging',
                    position: 1,
                    index: 1,
                },
            ]);
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
        async retryMigrate(account) {
            const revineAddress = revineAddressFromSeed(account.seedPhrase, account.index);
            await convertTokens(revineAddress, account.keyPair.publicKey());
            
        }
    },
};

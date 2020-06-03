import { mapActions, mapMutations } from 'vuex';
import { decodeBase64 } from 'tweetnacl-util';
import router from '../../router';
import { migrateToPkid } from '../../services/PkidMigrationService';
import config from '../../../public/config';
import Logger from 'js-logger';

export default {
    name: 'Init',
    components: {},
    props: [],
    data() {
        return {
            initialized: false,
            devWalletSeed: null,
        };
    },
    computed: {
        showInputWalletSeed() {
            return !!config.showInputWalletSeed;
        },
    },
    mounted() {
        window.vueInstance = this;
        if (config.devWallet) {
            window.vueInstance.startWallet(
                'devWallet.3bot',
                config.devWallet,
                null,
                null
            );
        }
    },
    methods: {
        ...mapActions(['initialize']),
        ...mapMutations(['setDebugSeed']),
        async startWallet(doubleName, seed, importedWallets, appWallets) {
            if (this.initialized) {
                return;
            }

            this.initialized = true;

            this.setDebugSeed(seed);
            seed = new Uint8Array(decodeBase64(seed));
            importedWallets = JSON.parse(importedWallets);
            appWallets = JSON.parse(appWallets);
            Logger.info('startedWallet');
            try {
                await migrateToPkid({ seed, importedWallets, appWallets });
            } catch (error) {
                Logger.error('fatal error migrateToPkid');

                // add fatal error
                return;
            }
            try {
                Logger.info('initialize');

                await this.initialize({
                    doubleName,
                    seed,
                    importedWallets,
                    appWallets,
                });
            } catch (error) {
                throw error;
                console.error(error);
                Logger.error('init error', { error });
                router.push({
                    name: 'error screen',
                    params: {
                        reason: 'Initialization failed',
                        fix:
                            'Please refresh, if error persists, please contact support?',
                    },
                });
            }
        },
        devInitWallet() {
            this.startWallet('TESTNAME', this.devWalletSeed, 'null', 'null');
        },
    },
};

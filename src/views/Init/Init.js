import { mapActions } from 'vuex';
import { decodeBase64 } from 'tweetnacl-util';
import router from '../../router';
import { migrateToPkid } from '../../services/PkidMigrationService';
import config from '../../../public/config';

export default {
    name: 'Init',
    components: {},
    props: [],
    data() {
        return {};
    },
    computed: {},
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
        async startWallet(doubleName, seed, importedWallets, appWallets) {
            seed = new Uint8Array(decodeBase64(seed));
            importedWallets = JSON.parse(importedWallets);
            appWallets = JSON.parse(appWallets);
            try {
                await migrateToPkid({ seed, importedWallets, appWallets });
            } catch (error) {
                // add fatal error
                return;
            }
            try {
                this.initialize({
                    doubleName,
                    seed,
                    importedWallets,
                    appWallets,
                });
                router.push({ name: 'home' });
            } catch (error) {
                console.log(error.message);
            }
        },
    },
};

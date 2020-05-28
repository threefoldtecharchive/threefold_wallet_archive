import { mapGetters, mapActions } from 'vuex';
import {
    isValidWalletName,
    validateAndGenerateSeed,
    importedSecretFound
} from '@/services/AccountManagementService';
import { seedPhraseFromStellarSecret } from '@jimber/stellar-crypto';
import router from '../../router';
import config from '../../../public/config';
import Logger from 'js-logger'

export default {
    name: 'create-wallet',
    components: {},
    props: {
        show: {
            type: Boolean,
        },
    },
    data() {
        return {
            tabs: ['import'], // create is disabled
            currentTab: 'import',
            walletName: null,
            secret: null,
            index: 0,
            walletNameErrors: [],
            secretErrors: [],
            panel: null
        };
    },
    computed: {
        ...mapGetters(['accounts']),
        secretIsStellarSecret(){
            return this.secret?.length == "56"
        }
    },
    mounted() {},
    methods: {
        ...mapActions([
            'generateAppAccount',
            'generateImportedAccount',
            'initializeAccountWatcher',
            'initializeTransactionWatcher',
        ]),
        clearForm() {
            this.$router.push({ name: 'home' });
            this.clearErrors();
            this.walletName = null;
            this.secret = null;
        },
        clearErrors() {
            this.walletNameErrors = [];
            this.secretErrors = [];
        },
        createNewWallet() {
            this.clearErrors();

            // Todo add removing of spaces in between words
            this.walletName = this.walletName.trim();

            const walletValidation = isValidWalletName(
                this.walletName,
                this.accounts
            );
            if (!walletValidation.success) {
                this.walletNameErrors.push(walletValidation.message);
                return;
            }
            this.generateAppAccount(this.walletName).catch(e => {
                this.$flashMessage.error('Failed to generate account');
            });
            this.clearForm();
        },
        importWallet(){
            this.clearErrors();

            // Todo add removing of spaces in between words
            this.walletName = this.walletName.trim();

            const walletValidation = isValidWalletName(
                this.walletName,
                this.accounts
            );

            if (!walletValidation.success) {
                this.walletNameErrors.push(walletValidation.message);
                return;
            }

            if(this.secret.length === 56){
                this.importStellarSeed()
                return
            }
            this.importNewWallet()
        },
        async importNewWallet() {
            const seedValidation = validateAndGenerateSeed(
                this.secret,
                this.accounts
            );

            if (!seedValidation.success) {
                this.secretErrors.push(seedValidation.message);
                return;
            }

            const seedPhrase = seedValidation.seedPhrase;
            const walletName = this.walletName;

            this.generateImportedAccount({
                seedPhrase,
                walletName,
                index: this.index,
            })
                .then(account => {
                    this.$flashMessage.info(
                        `Successfully imported ${account.name}.`
                    );
                    if (config.watchersEnabled) {
                        this.initializeAccountWatcher(account);
                        this.initializeTransactionWatcher(account);
                    }
                })
                .catch(e => {
                    router.push({
                        name: 'error screen',
                        params: {
                            reason: 'Failed to import new account.',
                            fix:
                                "Try again later, if that doesn't work contact support",
                        },
                    });
                });

            this.clearForm();
        },
        importStellarSeed() {
            const foundWallet = importedSecretFound(this.secret, this.accounts)
            
            if(foundWallet){
                this.secretErrors.push(`This stellar secret is used by ${foundWallet.name}`)
                return;
            }

            const seedPhrase = seedPhraseFromStellarSecret(this.secret);
            const walletName = this.walletName;
            const index = -1;

            this.generateImportedAccount({
                seedPhrase,
                walletName,
                index,
            })
                .then(account => {
                    this.$flashMessage.info(
                        `Successfully imported ${account.name}.`
                    );
                    if (config.watchersEnabled) {
                        this.initializeAccountWatcher(account);
                        this.initializeTransactionWatcher(account);
                    }
                })
                .catch(e => {
                    Logger.error('error generating imported wallet', {e})  
                    router.push({
                        name: 'error screen',
                        params: {
                            reason: 'Failed to import account.',
                            fix:
                                "Try again later, if that doesn't work contact support",
                        },
                    });
                });

            this.clearForm();
        },
    },
};

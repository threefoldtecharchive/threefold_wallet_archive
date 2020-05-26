import { mapGetters, mapActions } from 'vuex';
import {
    isValidWalletName,
    validateAndGenerateSeed,
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
            tabs: ['import', 'load'], // create is disabled
            currentTab: 'import',
            walletName: null,
            words: null,
            index: 0,
            stellarSecret: null,
            walletNameErrors: [],
            wordsErrors: [],
            stellarSecretErrors: [],
            panel: null
        };
    },
    computed: {
        ...mapGetters(['accounts']),
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
            this.words = null;
        },
        clearErrors() {
            this.walletNameErrors = [];
            this.wordsErrors = [];
            this.stellarSecretErrors = [];
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

        async importNewWallet() {
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

            const seedValidation = validateAndGenerateSeed(
                this.words,
                this.accounts
            );

            if (!seedValidation.success) {
                this.wordsErrors.push(seedValidation.message);
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
                            reason: 'Failed to import account.',
                            fix:
                                "Try again later, if that doesn't work contact support",
                        },
                    });
                });

            this.clearForm();
        },
        importStellarSeed() {
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
            const seedPhrase = seedPhraseFromStellarSecret(this.stellarSecret);
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

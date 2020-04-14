import { mapGetters, mapActions } from 'vuex';
import {
    isValidWalletName,
    validateAndGenerateSeed,
} from '@/services/AccountManagementService';
import router from '../../router';

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
            words: null,
            walletNameErrors: [],
            wordsErrors: [],
        };
    },
    computed: {
        ...mapGetters(['accounts']),
    },
    mounted() {},
    methods: {
        ...mapActions(['generateAppAccount', 'generateImportedAccount', 'initializeAccountWatcher', 'initializeTransactionWatcher']),
        clearForm() {
            this.$router.push({ name: 'home' });
            this.clearErrors();
            this.walletName = null;
            this.words = null;
        },
        clearErrors() {
            this.walletNameErrors = [];
            this.wordsErrors = [];
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
            })
                .then((account) => {
                    this.$flashMessage.info(
                        `Successfully imported ${account.name}.`
                    );
                    this.initializeAccountWatcher(account)
                    this.initializeTransactionWatcher(account)
                })
                .catch(e => {
                    router.push({
                        name: 'error screen',
                        params: {
                            reason: 'Failed to import account.',
                            fix:
                                'Try again later, if that doesn\'t work contact support',
                        },
                    });
                });

            this.clearForm();
        },
    },
};

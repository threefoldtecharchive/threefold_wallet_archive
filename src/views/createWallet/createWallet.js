import { mapGetters, mapActions } from 'vuex';
import {
  isValidWalletName,
  validateAndGenerateSeed,
} from '@/services/AccountManagementService';

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
      step: 0,
    };
  },
  computed: {
    ...mapGetters(['accounts']),
  },
  mounted() {},
  methods: {
    ...mapActions(['generateAppAccount', 'generateImportedAccount']),
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

      const seedValidation = validateAndGenerateSeed(this.words, this.accounts);

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
        .then(() => {
          this.$flashMessage.info(`Successfully imported ${walletName}.`);
        })
        .catch(e => {
          console.error(e);
          this.$flashMessage.error('Failed to import account.');
        });

      this.clearForm();
    },
  },
};

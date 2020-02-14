import AccountCard from '../../../../components/AccountCard';
export default {
  name: 'to-dialog',
  components: {
    AccountCard,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Function,
    },
    accounts: {
      type: Array,
    },
    toRules: {
      type: Array,
    },
    selectedAccount: {
      type: Object,
    },
  },
  data() {
    return {
      selected: 0,
      externAddress: '',
      tabs: [
        { name: 'Own wallets', value: 0 },
        { name: 'Others', value: 1 },
      ],
      valid: false,
    };
  },
  computed: {
    computedAccounts() {
      console.log('hello')
      return this.accounts.filter(x => x.name != this.selectedAccount.name)
    }
  },
  mounted() {},
  methods: {
    selectAccount(account) {
      console.log('in select account')
      this.closeDialog(true, {
        address: account.address,
        currency: account.currency,
        holder: account.holder,
        name: account.name,
        totalAmount: account.totalAmount,
      });
      this.$refs.externForm.reset();
      setTimeout(() => {
        this.selected = 0;
      }, 1000);
    },
  },
  watch: {
    selected() {
      this.$refs.externForm.resetValidation();
    },
  },
};

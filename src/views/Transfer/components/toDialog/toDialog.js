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
            return this.accounts.filter(
                x => x.name != this.selectedAccount.name
            );
        },
    },
    mounted() {},
    methods: {
        selectAccount() {
            this.closeDialog(true, {
                address: this.externAddress,
            });
            this.$refs.externForm.reset();
            setTimeout(() => {
                this.selected = 0;
            }, 1000);
        },
        useAccount(account) {
            this.closeDialog(true, {
                address: account.id,
            });
        },
    },
    watch: {
        selected() {
            this.$refs.externForm.resetValidation();
        },
    },
};

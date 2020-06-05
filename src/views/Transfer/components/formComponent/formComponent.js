import ToDialog from '../toDialog'
import { mapGetters } from 'vuex';

export default {
    name: 'form-component',
    components: {
        ToDialog,
    },
    props: {
        formObject: {
            type: Object,
            default: () => {},
        },
        selectedTab: {
            type: Number,
        },
        accounts: {
            type: Array,
            default: () => [],
        },
        selectedAccount: {
            type: Object,
            default: () => {},
        },
        fee: {
            type: Number,
        },
        selectedCurrency: {
            type: String,
            default: "TFT"
        }
    },
    data() {
        return {
            maxMessageLength: 28,
            toDialog: false,
            valid: false,
            tooltip: false,
        };
    },
    computed: {
        ...mapGetters([
            'currencies'
        ]),
        toRules() {
            const rules = [
                v => !!v || 'Wallet address is required!',
                v =>
                    (!!v && v.length >= 56 && v.length <= 56) ||
                    'Wallet address length is not valid!',
            ];
            return rules;
        },
        messageRules() {
            const rules = [
                v => !!v || 'Message is required!',
                v =>
                    typeof v == 'undefined' ||
                    (typeof v === 'string' &&
                        v.length <= this.maxMessageLength) ||
                    `Message cannot be more than ${this.maxMessageLength} characters long`,
            ];
            return rules;
        },
        amountRules() {
            const rules = [
                v => !!v || 'The amount is required',
                v =>
                    (!!v && Number(v) > 0) ||
                    'The amount must be greater than 0',
                // @TODO add this to validate the balance
                // v => !!v && Number(v) <= Number((this.accounts.find(x => x.address == this.selectedWallet.address).totalAmount.replace(",", "") - 0.10).toFixed(9)) || 'Your balance is insufficient'
            ];
            return rules;
        },
    },
    mounted() {},
    methods: {
        closetoDialog(save, wallet) {
            if (save) {
                this.formObject.to = wallet;
            }
            this.toDialog = false;
            this.$refs.toDialog.$refs.externForm.reset();
        },
        selectWallet(wallet) {
            this.formObject.to = {
                name: wallet.name,
                currency: wallet.currency,
                address: wallet.address,
                holder: wallet.holder,
                totalAmount: wallet.totalAmount,
            };
        },
    },
};

import accountCard from '../../../../components/AccountCard';
import { mapGetters } from 'vuex';
export default {
    name: 'transaction-info-dialog',
    components: { accountCard },
    props: {
        dialog: {
            type: Boolean,
        },
        closeDialog: {
            type: Function,
        },
        send: {
            type: Function,
        },
        selectWallet: {
            type: Function,
        },
        accounts: {
            type: Array,
            default: () => [],
        },
        selectedAccount: {
            type: Object,
            default: () => {},
        },
        formObject: {
            type: Object,
            default: () => {},
        },
        selectedCurrency: {
            type: String
        }
    },
    mounted() {
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        document.body.appendChild(field);

        setTimeout(function() {
            field.focus();
            setTimeout(function() {
                field.setAttribute('style', 'display:none;');
            }, 50);
        }, 50);
    },
    computed: {
        ...mapGetters(['fee']),
        amount() {
            if (this.$route.query.tab == 'receive') {
                return Number(this.formObject.amount)
            }
            if (this.selectedCurrency ==='BTC'){
                return Number(this.formObject.amount)
            }

            return (
                Number(this.formObject.amount) + Number(this.fee / 1000)
            );
        },
        toAccountIsOwn() {
            return this.accounts.find(
                x =>
                    x.id.toLowerCase() ==
                    this.formObject.to.address.toLowerCase()
            );
        },
    },
};

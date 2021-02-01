import AccountCard from '../../components/AccountCard';
import Balance from '../../components/Balance';
import PaymentItem from '../../components/PaymentItem';
import PaymentDialog from '../../components/PaymentDialog';
import LockedItem from '../../components/LockedItem';
import secretDialog from './Components/secretDialog';
import deleteDialog from './Components/deleteDialog.vue';
import store from '../../store';
import router from '../../router';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import InfiniteLoading from 'vue-infinite-loading';
import { fetchPayments } from '../../services/PaymentService';
import {
    isValidWalletName,
} from '@/services/AccountManagementService';
import AssetCard from '@/components/AssetCard';
import ActivatCard from '@/components/ActivateCard';
import CopyField from '@/components/CopyField';

export default {
    name: 'Details',
    components: {
        AccountCard,
        Balance,
        PaymentItem,
        PaymentDialog,
        LockedItem,
        InfiniteLoading,
        secretDialog,
        deleteDialog,
        AssetCard,
        ActivatCard,
        CopyField,
    },
    props: [],
    data() {
        return {
            selectedPayment: null,
            name: null,
            tab: 0,
            selectedCurrency: 'All',
            fetchingPayments: false,
            secretDialog: false,
            deleteDialog: false,
        };
    },
    beforeMount() {
        const account = store.getters.accounts.find(
            x => x.id === this.$route.params.account,
        );
        if (!account) {
            router.push({ name: 'home' });
            return;
        }
        this.id = account.id;
    },
    methods: {
        ...mapActions(['fetchPayments', 'changeWalletName', 'deleteAccount', 'updateAccount', 'initializeAccountEventStreams']),
        ...mapMutations(['addPayments']),
        seeTransactionsFor(asset_code) {
            this.selectedCurrency = asset_code;
            this.tab = 1;

        },
        openPayment(payment) {
            this.selectedPayment = payment;
        },
        showDate(payment, i) {
            const previousPayment = this.accountPayments[i - 1];
            if (!previousPayment) {
                return true;
            }
            const time = moment(String(payment.created_at));

            return !time.isSame(String(previousPayment.created_at), 'day');
        },
        change() {
            const name = this.name.charAt(0).toUpperCase() + this.name.substring(1);
            this.name = this.name.trim();

            const walletValidation = isValidWalletName(
                this.name,
                this.accounts,
            );
            if (!walletValidation.success) {
                this.$flashMessage.error(
                    walletValidation.message,
                );
                return;
            }

            this.changeWalletName({ account: this.account, name });
            router.push({ name: 'home' });
            this.$flashMessage.info(`Renamed wallet to ${name}.`);
        },
        async deleteWallet() {
            await this.deleteAccount(this.account);
            router.push({ name: 'home' });
            this.$flashMessage.info(`Deleted wallet ${this.name}.`);
        },
        async infiniteHandler($state) {
            const initialLength = this.accountPayments.length;
            const lastPayment = this.accountPayments[
                initialLength - 1
            ];
            const id = lastPayment ? lastPayment.id : 'now';
            const payments = await fetchPayments(this.id, id);

            if (payments.length === 0) {
                $state.complete();
            }

            this.addPayments({ payments, id: this.id });

            if (this.accountPayments === initialLength) {
                $state.complete();
            }

            $state.loaded();
        },
        async updatePayments() {
            this.fetchingPayments = true;
            await this.fetchPayments(this.account.id);
            this.fetchingPayments = false;
        },
        enabledialog() {
            console.log('hell');
            this.deleteDialog = true;
        },
    },
    computed: {
        ...mapGetters([
            'threeBotName',
            'payments',
            'accounts',
            'isPaymentLoading',
            'currencies',
        ]),
        hasMultipleTrustlines() {
            return this.account.balances > 1;
        },
        account() {
            return this.accounts.find(a => a.id === this.id);
        },
        accountPayments() {
            return this.payments(this.id);
        },
        filteredAccountPayments() {
            return this.payments(this.id).filter(payment => {
                return this.selectedCurrency === 'All' || payment.asset_code === this.selectedCurrency;
            });
        },
        getHumanWalletAddress() {
            return `${this.account.name.replace(/\s/g, '')}@${
                this.threeBotName
            }`;
        },
        filterOptions() {
            return ['All', ...this.account.balances.map(b => b.asset_code)];
        },
    },
    mounted() {
        this.fetchPayments(this.account.id);
        this.updateAccount(this.account.id);
        this.initializeAccountEventStreams([this.account]);
        this.name = this.account.name;
    },
};

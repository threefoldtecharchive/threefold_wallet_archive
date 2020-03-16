import AccountCard from '../../components/AccountCard';
import Balance from '../../components/Balance';
import PaymentItem from '../../components/PaymentItem';
import PaymentDialog from '../../components/PaymentDialog';
import store from '../../store';
import router from '../../router';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';


export default {
  name: 'Details',
  components: { AccountCard, Balance, PaymentItem, PaymentDialog },
  props: [],
  data() {
    return {
      selectedPayment: null,
    };
  },
  beforeMount() {
    const account = store.getters.accounts.find(
      x => x.name === this.$route.params.account,
    );
    if (!account) {
      router.push({ name: 'home' });
      return;
    }
    this.id = account.id;
  },
  methods: {
    ...mapActions(['fetchPayments']),
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
  },
  computed: {
    ...mapGetters(['threeBotName', 'payments', 'accounts']),
    account() {
      return this.accounts.find(a => a.id === this.id);
    },
    accountPayments() {
      return this.payments(this.id);
    },
    getHumanWalletAddress() {
      return `${this.account.name.replace(/\s/g, '')}@${this.threeBotName}`;
    },
  },
  mounted() {
    this.fetchPayments(this.account.id);
  },
};

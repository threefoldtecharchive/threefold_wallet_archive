import AccountCard from '../../components/AccountCard';
import Balance from '../../components/Balance';
import PaymentItem from '../../components/PaymentItem';
import PaymentDialog from '../../components/PaymentDialog';
import store from '../../store';
import router from '../../router';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Details',
  components: { AccountCard, Balance, PaymentItem, PaymentDialog },
  props: [],
  data () {
    return {
      account: null,
      selectedPayment: null,
    };
  },
  beforeMount () {
    const account = store.getters.accounts.find(
      x => x.name === this.$route.params.account
    );
    if (!account) {
      router.push({ name: 'home' });
      return;
    }
    this.account = account;
  },
  methods: {
    ...mapActions(['fetchPayments']),
    openPayment (payment) {
      this.selectedPayment = payment;
    },
  },
  computed: {
    ...mapGetters(['threeBotName', 'payments']),
    getHumanWalletAddress () {
      return `${this.account.name.replace(/\s/g, '')}@${this.threeBotName}`;
    },
  },
  beforeMount () {
    const account = store.getters.accounts.find(
      x => x.name === this.$route.params.account
    );
    if (!account) {
      router.push({ name: 'home' });
      return;
    }
    this.account = account;
  },
  mounted () {
    this.fetchPayments(this.account.id);
  },
};

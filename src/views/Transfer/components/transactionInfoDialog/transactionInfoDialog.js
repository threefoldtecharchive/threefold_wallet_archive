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
  },
  mounted () {},
  computed: {
    ...mapGetters(['fee']),
    amount () {
      console.log(
        (Number(this.formObject.amount) + Number(this.fee)).toFixed(2)
      );

      if (this.$route.query.tab == 'receive') {
        return Number(this.formObject.amount).toFixed(2);
      }

      return (Number(this.formObject.amount) + Number(this.fee/1000)).toFixed(2);
    },
    toAccountIsOwn () {
      return this.accounts.find(
        x => x.id.toLowerCase() == this.formObject.to.address.toLowerCase()
      );
    },
  },
};

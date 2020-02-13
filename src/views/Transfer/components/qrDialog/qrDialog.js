import qrcode from '@chenfengyuan/vue-qrcode';
import walletCard from '../../../../components/walletCard';
export default {
  name: 'qr-dialog',
  components: {
    qrcode,
    walletCard,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Function,
    },
    formObject: {
      type: Object,
      default: () => {},
    },
    selectedTab: {
      type: Number,
    },
    selectedWallet: {
      type: Object,
    },
  },
  computed: {
    qrText() {
      // return { tft: '01ed90bee1d6d50b730a1aacf2890ac6fc0f7718849fba5f7c5719e3cfcc4641be09c5607b0210', amount: 0 }
      return `tft:${this.selectedWallet.address}?amount=${this.formObject.amount}&message=${this.formObject.message}&sender=me`;
    },
  },
};

export default {
  name: 'paymentDialog',
  props: {
    payment: {
      type: Object,
    },
  },
  data() {
    return {
      memo: null,
    };
  },
  methods: {
    close() {
      this.$emit('closed');
    },
  },
  mounted() {
    console.log(this.payment);
    this.payment.memo().then(m => {
      this.memo = m;
    });
  },
};

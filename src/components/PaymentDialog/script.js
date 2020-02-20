export default {
  name: 'paymentDialog',
  props: {
    payment: {
      type: Object,
    },
  },
  methods: {
    close () {
      this.$emit('closed');
    },
  },
};

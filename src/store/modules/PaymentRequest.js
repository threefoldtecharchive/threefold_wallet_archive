export default {
    state: {
        paymentRequest: null,
    },
    actions: {},
    mutations: {
        setPaymentRequest(state, paymentRequest) {
            state.paymentRequest = paymentRequest;
        },
        clearPaymentRequest(state) {
            state.paymentRequest = null;
        },
    },
    getters: {
        paymentRequest: state => state.paymentRequest,
    },
};

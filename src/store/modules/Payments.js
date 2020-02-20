import { fetchPayments } from '../../services/PaymentService';

export default {
  state: {
    // { "id": "pubKey", "payments": payments[]}
    payments: [],
  },
  computed: {},
  actions: {
    fetchPayments: async ({ commit }, id) => {
      const payments = await fetchPayments(id);
      commit('addPayment', { payments, id });
    },
  },
  mutations: {
    addPayment: (state, payload) => {
      const index = state.payments.findIndex(a => a.id === payload.id);

      if (index === -1) {
        state.payments.push(payload);
        return;
      }
      state.payments[index] = payload;
    },
  },
  getters: {
    payments: state => id => {
      const payload = state.payments.find(obj => obj.id == id);
      if (!payload) {
        return [];
      }
      return payload.payments;
    },
  },
};

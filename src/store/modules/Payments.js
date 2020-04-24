import { fetchPayments } from '../../services/PaymentService';
import moment from 'moment';
import config from '../../../public/config';

export default {
    state: {
        payments: [],
        loadingPayments: [],
    },
    computed: {},
    actions: {
        fetchPayments: async ({ commit }, id) => {
            commit('addPaymentLoading', id);
            const payments = await fetchPayments(id);
            commit('addPayments', { payments, id });
            commit('removePaymentLoading', id);
        },
    },
    mutations: {
        addPaymentLoading(state, id) {
            state.loadingPayments = [...state.loadingPayments, id];
        },
        removePaymentLoading(state, id) {
            state.loadingPayments = state.loadingPayments.filter(
                lp => lp !== id
            );
        },
        addPayments: (state, payload) => {
            const id = payload.id;

            const payments = payload.payments.filter(p => {
                if (!config.currencies[p.asset_code]) {
                    console.log(
                        p.asset_code, ' is not supported'
                    );
                    return false;
                }
                return true;
            });

            payload = { id, payments };

            const index = state.payments.findIndex(a => a.id === payload.id);

            if (index === -1) {
                state.payments.push(payload);
                return;
            }

            const currentPayments = state.payments[index].payments;
            for (const payment of payments) {
                if (!payment.id) {
                    continue;
                }

                const index = currentPayments.findIndex(
                    cp => cp.id === payment.id
                );
                if (index === -1) {
                    currentPayments.push(payment);
                    continue;
                }

                currentPayments[index] = payment;
            }
            currentPayments.sort((a, b) =>
                moment(b.created_at).isBefore(a.created_at) ? -1 : 1
            );

            state.payments[index] = { id, payments: currentPayments };
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
        isPaymentLoading: state => id => {
            return state.loadingPayments.includes(id);
        },
    },
};

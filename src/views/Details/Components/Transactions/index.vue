<template>
    <v-container v-if="!accountPayments.length && isPaymentLoading(account.id)">
        <v-row align-content="center" justify="center">
            <v-col class="subtitle-1 text-center" cols="12">
                Getting payments
            </v-col>
            <v-col cols="6">
                <v-progress-linear
                    color="deep-purple accent-4"
                    indeterminate
                    rounded
                    height="6"
                ></v-progress-linear>
            </v-col>
        </v-row>
        <v-list three-line class="pa-0 payment-list">
            <template v-for="(payment, i) in accountPayments">
                <div class="date" v-if="showDate(payment, i)">
                    <span>
                        {{ payment.created_at | formatDay }}
                    </span>
                    <v-divider></v-divider>
                </div>

                <paymentItem
                    :key="payment.id"
                    :payment="payment"
                    class="payment-item"
                    @click.stop="selectedPayment = payment"
                />
            </template>
            <infinite-loading
                class="py-4"
                @infinite="infiniteHandler"
                spinner="waveDots"
            >
                <div slot="no-more">
                    No {{ accountPayments.length ? 'more ' : '' }}payments
                    {{ accountPayments.length ? ' ' : 'yet' }}
                </div>
            </infinite-loading>
        </v-list>
    </v-container>
</template>

<script>
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import InfiniteLoading from 'vue-infinite-loading';
    import PaymentItem from '../../../../components/PaymentItem';

    export default {
        components: {
            InfiniteLoading,
            PaymentItem,
        },
        data: function () {
            return {};
        },
        props: {
            accountPayments: {
                type: Array,
            },
            account: {
                type: Object,
            },
        },
        methods: {
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
            ...mapGetters(['isPaymentLoading']),
        },
    };
</script>

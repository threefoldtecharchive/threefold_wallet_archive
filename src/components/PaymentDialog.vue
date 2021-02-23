<template>
    <v-dialog v-model="payment" @input="close">
        <v-card class="payment-dialog">
            <v-card-title
                style="background-color: #34495e; color: white;"
                dense
            >
                Transaction details
                <v-spacer></v-spacer>
                <v-btn text icon @click="close">
                    <v-icon :color="$route.meta.accent">
                        fa-times
                    </v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text style="padding: 0;">
                <v-row>
                    <v-col
                        justify="center"
                        align="center"
                        :class="
                            !payment.outgoing
                                ? 'payment-header out'
                                : 'payment-header in'
                        "
                    >
                        <b class="my-1 title">
                            {{ payment.outgoing ? '-' : '+' }}
                            {{ payment.amount | formatBalance }}
                            <sup>{{
                                payment.asset_code ||
                                (payment.asset_type === 'native'
                                    ? 'xlm'
                                    : payment.asset_type)
                            }}</sup>
                        </b>
                        <small
                            style="font-size: small;"
                            v-if="payment.outgoing"
                        >
                            <!-- <= 0.1 <sup>TFT</sup> fee excluded -->
                        </small>
                    </v-col>
                </v-row>

                <v-row class="px-6 pt-2">
                    <v-col>
                        <p class="subtitle mb-0 grey--text">Date</p>
                        <p class="title mt-0">
                            {{ payment.created_at | formatDate }}
                        </p>

                        <p class="subtitle mb-0 grey--text">From</p>
                        <p class="title mt-0">
                            {{ payment.from | readableAddress }}
                        </p>

                        <p class="subtitle mb-0 grey--text">To</p>
                        <p class="title mt-0">
                            {{ payment.to | readableAddress }}
                        </p>

                        <p v-if="memo" class="subtitle mb-0 grey--text">
                            Message
                        </p>
                        <p v-if="memo" class="title mt-0">{{ memo }}</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
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
            this.payment.memo().then(m => {
                this.memo = m;
            });
        },
    };
</script>
<style scoped lang="scss">
    .payment-header {
        background: #4a5c70;
        color: white;
        height: 15vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &.out {
            background-color: var(--accent-color);
        }
        &.in {
            background-color: #ff4a4a;
        }
    }
</style>

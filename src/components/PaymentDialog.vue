<template>
    <v-dialog persistent v-model="payment">
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
                            payment.outgoing
                                ? 'payment-header out'
                                : 'payment-header in'
                        "
                    >
                        <b class="my-1">
                            {{ payment.outgoing ? '-' : '+' }}
                            {{ payment.amount | formatBalance }}
                            <sup>TFT</sup>
                        </b>
                        <small
                            style="font-size: small;"
                            v-if="payment.outgoing"
                        >
                            0.1 <sup>TFT</sup> fee excluded
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
    .v-card {
        position: fixed;
        top: 10vh;
        left: 50%;
        transform: translate(-50%, 0);
        width: 80vw;
    }

    .v-application .title {
        font-size: 4vw !important;
        line-height: 4vw !important;
    }

    .v-card__text {
        font-size: 4vw;
        line-height: 4vw;
    }

    .v-application .body-1 {
        font-size: 3vw !important;
    }

    .v-btn--icon.v-size--default .v-icon {
        font-size: 5vw !important;
    }

    @media screen and (min-width: 1000px) {
        .v-btn--icon.v-size--default .v-icon {
            font-size: 50px !important;
        }
    }

    @media screen and (max-width: 500px) {
        .v-card__text {
            font-size: 1.25rem;
            line-height: 1.5rem;
        }
        .v-application .title {
            font-size: 1.25rem !important;
            line-height: 1.25rem !important;
        }
        .v-application .body-1 {
            font-size: 0.8rem !important;
            line-height: 1rem !important;
        }
    }

    @media screen and (min-width: 800px) {
        .v-card__text {
            font-size: 2rem;
            line-height: 2rem;
        }
        .v-application .title {
            font-size: 2rem !important;
            line-height: 2rem !important;
        }
        .v-application .body-1 {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
        }
    }
    .payment-dialog {
        padding: 0;
    }
    .payment-header {
        background: #4a5c70;
        color: white;
        height: 15vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &.out {
            background-image: linear-gradient(180deg, #e6926d 0%, #e67163 100%);
        }
        &.in {
            background-image: linear-gradient(180deg, #73e5c0 0%, #68c5d5 100%);
        }
    }
</style>

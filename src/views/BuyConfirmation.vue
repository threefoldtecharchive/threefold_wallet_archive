<template>
    <div class="Buy fill-height flex-column">
        <v-card class="fill-height pt-2" v-if="tradeInfo" full>
            <v-card-title><h1>Order Confirmation</h1></v-card-title>
            <v-card-text>
                <div>
                    <h2>Order Summary:</h2>
                    {{ tradeInfo.sellAssetCode }} Amount:
                    <b> {{ tradeInfo.amount }} {{ tradeInfo.sellAssetCode }}</b> (<b
                        >{{ tradeInfo.shownAmountInUsd.toFixed(3) }} USD</b
                    >) <br />
                    Sum: est. <b>{{ tradeInfo.shownAmountTft }} {{ tradeInfo.buyAssetCode }}</b> <br />
                    Max Price: <b> {{ (1 / tradeInfo.price).toFixed(8) }} {{ tradeInfo.sellAssetCode }}</b> (<b
                        >{{ tradeInfo.shownPriceInUSD }} USD</b
                    >) / <b>1 {{ tradeInfo.buyAssetCode }}</b
                    >.
                </div>
            </v-card-text>
            <v-card-actions class="flex-column">
                <span class="px-2 pb-2 font-s text--darken-2 grey--text"
                    >By clicking 'Confirm Order', you confirm that you have read and agree with our
                    <a class="pa-0" @click.prevent="showTerms = true">Terms and conditions </a>
                </span>
                <v-btn class="mb-2" @click="onAgreeClick" block color="accent" elevation="0">Confirm Order</v-btn>
                <v-btn @click="$router.push({ name: 'home' })" block text color="error" elevation="0">Cancel</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="showTerms" fullscreen eager>
            <v-card>
                <v-card-title>
                    <v-row>
                        Terms & conditions
                        <v-spacer></v-spacer>
                        <v-btn icon @click="showTerms = false">
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-row>
                </v-card-title>
                <iframe
                    style="height: calc(100vh - 62px); width: 100%"
                    src="https://threefold.io/info/threefold#/legal__terms_conditions_griduser"
                    frameborder="0"
                ></iframe>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { getPairPrice } from '@jimber/stellar-crypto';

    export default {
        name: 'BuyConfirmation',
        mounted() {
            if (!this.tradeInfo) {
                this.$router.push({ name: 'home' });
            }
            getPairPrice('XBTUSDC').then(price => {
                this.currentBtcPrice = price;
            });
        },
        computed: {
            ...mapGetters(['tradeInfo']),
        },
        methods: {
            ...mapMutations(['setTradeInfo']),
            onAgreeClick() {
                this.setTradeInfo({ ...this.tradeInfo, accept: true });
                this.$router.push({ name: 'trading' });
            },
        },
        data() {
            return {
                showTerms: false,
                currentBtcPrice: 0,
            };
        },
    };
</script>

<style scoped>
    .Buy {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    hr {
        border-radius: 20px;
        border: 2px solid #3a3a3a;
    }
</style>

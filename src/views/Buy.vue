<template>
    <div class="Buy pa-2 fill-height">
        <v-card class="pa-2" style="width: 100%">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title> Account: {{ account.name }}</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model.number.lazy="btcAmount"
                        persistent-hint
                        label="Amount BTC"
                        type="number"
                        step="0.001"
                        max="150"
                        min="0.000001"
                        required
                        :rules="[
                            v => !!v || 'Btc amount is required',
                            v =>
                                v <= account.balances.find(b => b.asset_code === 'BTC').balance ||
                                'Minimum price is 0.1',
                        ]"
                    ></v-text-field>
                    <div class="btns">
                        <v-btn
                            class="pa-1 mr-2"
                            small
                            elevation="0"
                            color="#e0e0e0"
                            @click="btcAmount = account.balances.find(b => b.asset_code === 'BTC').balance * 0.25"
                            >25%
                        </v-btn>
                        <v-btn
                            class="pa-1 mr-2"
                            small
                            elevation="0"
                            color="#e0e0e0"
                            @click="btcAmount = account.balances.find(b => b.asset_code === 'BTC').balance * 0.5"
                            >50%
                        </v-btn>
                        <v-btn
                            class="pa-1 mr-2"
                            small
                            elevation="0"
                            color="#e0e0e0"
                            @click="btcAmount = account.balances.find(b => b.asset_code === 'BTC').balance * 0.75"
                            >75%
                        </v-btn>
                        <v-btn
                            class="pa-1 mr-2"
                            small
                            elevation="0"
                            color="#e0e0e0"
                            @click="btcAmount = account.balances.find(b => b.asset_code === 'BTC').balance"
                            >100%
                        </v-btn>
                    </div>
                    <v-text-field
                        v-model="priceUsd"
                        disabled
                        persistent-hint
                        label="amount in usd"
                        class="mt-2"
                        type="number"
                    ></v-text-field>
                    <hr class="my-4" />
                    <pre>
                {{ amountTft }}
                  (1 / (btcAmount * price in tft)).toFixed(8)

                  price = this.currentBtcPrice / usdPrice
                {{ (1 / price).toFixed(8) }}
              </pre
                    >
                    <!--                <v-text-field-->
                    <!--                    :value="priceInTFT"-->
                    <!--                    @change="onChangeTFTPrice"-->
                    <!--                    persistent-hint-->
                    <!--                    color="black"-->
                    <!--                    label="Price in TFT"-->
                    <!--                    hint="minimum a mount of of tft you will get"-->
                    <!--                    type="number"-->
                    <!--                ></v-text-field>-->
                    <v-text-field
                        :value="priceInUSD"
                        @change="onChangeUSDPrice"
                        persistent-hint
                        color="black"
                        label="Price in Usd"
                        hint="The price you want (in USD) for 1 TFT"
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="150"
                        required
                        :rules="[v => !!v || 'price is required', v => v >= 0.1 || 'Minimum price is 0.1']"
                    ></v-text-field>
                    <hr class="my-4" />

                    <p>
                        lorem ipsuim dolor sit amed <b>{{ amountTft }}</b> TFT
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="accent" block elevation="0" @click="onSubmit" :disabled="!valid"
                        >Submit this buy order</v-btn
                    >
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';
    import { getPairPrice } from '@jimber/stellar-crypto';
    import { mapMutations } from 'vuex';

    export default {
        name: 'Buy',

        beforeMount() {
            this.account = store.getters.accounts.find(x => x.id === this.$route.params.account);
            if (!this.account) {
                router.push({ name: 'error screen' });
                return;
            }

            if (!this.account.balances.find(b => b.asset_code === 'BTC')) {
                this.$router.push({
                    name: 'activate',
                    params: {
                        account: this.account.id,
                        asset: 'BTC',
                    },
                });

                this.$flashMessage.error(`BTC is not yet activated, please activate it before continuing.`);

                return;
            }
        },
        data() {
            return {
                account: null,
                btcAmount: 1,
                currentBtcPrice: 0,
                price: 0,
                usdPrice: 0.15,
                valid: null,
            };
        },
        mounted() {
            getPairPrice('XBTUSDC').then(price => {
                this.currentBtcPrice = price;
                this.price = price / this.usdPrice;
            });
            this.btcAmount = this.account.balances.find(b => b.asset_code === 'BTC').balance;
        },
        computed: {
            amountTft() {
                return (1 / Number((1 / (this.btcAmount * this.price)).toFixed(8))).toFixed(2);
            },
            priceUsd() {
                return this.btcAmount * this.currentBtcPrice;
            },
            priceInUSD: {
                get: function () {
                    return this.usdPrice.toFixed(3);
                },
                set: function (value) {},
            },
            priceInTFT() {
                return this.price.toFixed(4);
            },
        },
        methods: {
            ...mapMutations(['setTradeInfo']),
            onChangeTFTPrice(value) {
                const tftPrice = Number(value) > 1000 ? Number(value) : 1000;
                this.price = tftPrice;
                this.usdPrice = this.currentBtcPrice / tftPrice ? this.currentBtcPrice / tftPrice : 0;
            },
            onChangeUSDPrice(value) {
                const usdPrice = Number(value) > 0.1 ? Number(value) : 0.1;

                const min = 0.1;
                const max = 1000;
                this.usdPrice = Math.min(Math.max(this.usdPrice, min), max);
                this.price = this.currentBtcPrice / usdPrice ? this.currentBtcPrice / usdPrice : 0;

                this.price = Number(this.price) > 1000 ? Number(this.price) : 1000;
            },
            onSubmit() {
                this.setTradeInfo({
                    id: this.account.id,
                    buyAssetCode: 'TFT',
                    sellAssetCode: 'BTC',
                    amount: this.btcAmount,
                    price: Number(this.price.toFixed(8)),
                });
                this.$router.push({ name: 'buyConfirmation' });
            },
        },
        watch: {
            btcAmount(value, oldvalue) {
                const min = 0.00001;
                const max = 150;
                this.btcAmount = Math.min(Math.max(value, min), max);
            },
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

<template>
    <div class="Buy fill-height">
        <v-card class="pa-2 fill-height" style="width: 100%" v-if="account">
            <v-card-title> Wallet: {{ account.name }}</v-card-title>
            <v-card-text>
                <v-col>
                    <v-row class="pb-2">
                        <h3 class="font-italic error--text">Keep this screen open to continue trading</h3>
                    </v-row>
                </v-col>
                <v-col class="pb-2">
                    <v-row class="pb-2">
                        <span>
                            <h2 class="dots pb-2">Trading</h2>
                            <b>{{ tradeInfo.amount }} {{ tradeInfo.sellAssetCode }}</b> (<b
                                >{{ tradeInfo.shownAmountInUsd.toFixed(3) }} USD</b
                            >) <br />
                            for an estimated <b>{{ tradeInfo.shownAmountTft }} {{ tradeInfo.buyAssetCode }}</b>
                            <br /><br />
                            At a maximum price of
                            <b>{{ (1 / tradeInfo.price).toFixed(8) }} {{ tradeInfo.sellAssetCode }}</b> (<b
                                >{{ tradeInfo.shownPriceInUSD }} USD</b
                            >) per <b>1 {{ tradeInfo.buyAssetCode }}</b
                            >.
                        </span>
                    </v-row>
                    <v-row class="pa-8" justify="center">
                        <v-progress-circular indeterminate color="blue" size="100"></v-progress-circular>
                    </v-row>
                    <v-row justify="center">
                        <span>block {{ currentBlock }} / {{ blockAmount }}</span>
                    </v-row>
                    <v-row justify="center">
                        <span v-if="currentBlock >= 0"
                            >trade
                            {{ Math.round(((currentBlock - 1 > 0 ? currentBlock - 1 : 0) / blockAmount) * 100) }} %
                            completed</span
                        >
                    </v-row>
                </v-col>

                <!--                <v-col>-->
                <!--                    <v-row>-->
                <!--                        <h2>CurrentTrade:</h2>-->
                <!--                        <pre class="px-4" style="white-space: pre-wrap; width: 100%">{{ tradeInfo }}</pre>-->
                <!--                        <br />-->
                <!--                        <pre class="px-4" style="white-space: pre-wrap; width: 100%">{{ maxBTCInblock }}</pre>-->
                <!--                        <br />-->
                <!--                        <pre class="px-4" style="white-space: pre-wrap; width: 100%">{{ currentOffer }}</pre>-->
                <!--                    </v-row>-->
                <!--                    <v-row>-->
                <!--                        <h2 class="dots">Trading</h2>-->
                <!--                    </v-row>-->
                <!--                    <v-row class="pa-8" justify="center">-->
                <!--                        <v-progress-circular indeterminate color="amber" size="100"></v-progress-circular>-->
                <!--                    </v-row>-->
                <!--                    <v-row justify="center">-->
                <!--                        <span>block {{ currentBlock }} / {{ blockAmount }}</span>-->
                <!--                    </v-row>-->
                <!--                </v-col>-->
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="onStopClick" color="error" elevation="0">Stop Trading</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import {
        sellAssetForTft,
        getPairPrice,
        closeTradeOffer,
        getOpenTradeOffers,
        getConfig,
    } from '@jimber/stellar-crypto';

    export default {
        name: 'Trading',
        mounted() {
            if (!this.tradeInfo || !this.tradeInfo.accept) {
                this.$router.push({ name: 'home' });
                return;
            }

            this.account = this.accounts.find(x => x.id === this.tradeInfo.id);
            if (!this.account) {
                this.$router.push({ name: 'error screen' });
                return;
            }

            this.startTrade();
        },
        beforeDestroy() {
            if (this.interval) clearInterval(this.interval);

            this.clearTradeInfo();
        },
        computed: {
            ...mapGetters(['tradeInfo', 'accounts']),
        },
        methods: {
            ...mapMutations([
                'setTradeInfo',
                'clearTradeInfo',
                'startAppLoading',
                'stopAppLoading',
                'setLoadingMessage',
            ]),
            async onStopClick() {
                // Add dialog

                this.startAppLoading();
                if (this.currentOffer) {
                    this.setLoadingMessage({ message: 'Removing offer' });

                    await closeTradeOffer(this.account.keyPair, Number(this.currentOffer));
                }

                await this.$router.push({
                    name: 'details',
                    params: {
                        account: this.tradeInfo.id,
                    },
                });
                this.stopAppLoading();
            },
            async startTrade() {
                // close previouse trades

                const openTradeOffers = await getOpenTradeOffers(this.account.keyPair);

                for (const openTradeOffer of openTradeOffers) {
                    if (
                        openTradeOffer.selling.asset_code === this.tradeInfo.sellAssetCode ||
                        openTradeOffer.buying.asset_code === this.tradeInfo.buyAssetCode
                    )
                        await closeTradeOffer(this.account.keyPair, Number(openTradeOffer.id));
                }

                const fixedMaxUSDBlockSize = 200;
                const BTCPriceInUSD = await getPairPrice('XBTUSDC');
                this.maxBTCInblock = fixedMaxUSDBlockSize / BTCPriceInUSD;

                const normalBlockAmount = Math.ceil(this.tradeInfo.amount / this.maxBTCInblock);
                this.blockAmount = normalBlockAmount;

                if (normalBlockAmount > 100) {
                    this.blockAmount = 100;
                    this.maxBTCInblock = this.tradeInfo.amount / 100;
                }

                for (let i = 1; i <= this.blockAmount; i++) {
                    this.currentBlock = i;
                    let amountOfBTC =
                        this.currentBlock === this.blockAmount
                            ? this.tradeInfo.amount - (this.blockAmount - 1) * this.maxBTCInblock
                            : this.maxBTCInblock;

                    await this.startBlockTrade(
                        amountOfBTC,
                        this.tradeInfo.price,
                        this.tradeInfo.buyAssetCode,
                        this.tradeInfo.sellAssetCode
                    );
                }

                await this.$router.push({
                    name: 'details',
                    params: {
                        account: this.tradeInfo.id,
                    },
                });

                this.$flashMessage.info(`all order blocks closed`);
            },
            async startBlockTrade(amount, price, buyAsset, sellAsset) {
                if (buyAsset !== 'TFT') throw new Error(`asset ${buyAsset} not yet supported to buy`);

                const { /** @type {Server} */ server } = getConfig();
                const result = await sellAssetForTft(this.account.keyPair, sellAsset, price, amount);

                if (result.closed) return;

                this.currentOffer = result.offerId;
                console.log(this.currentOffer);

                const closedPromise = new Promise((resolve, reject) => {
                    this.interval = setInterval(async () => {
                        try {
                            await server.offers().offer(`${this.currentOffer}`).call();
                        } catch (e) {
                            // hmmm ....
                            if (e.name === 'NotFoundError') resolve();

                            reject(e);
                        }
                    }, 3000);
                });
                await closedPromise;
                clearInterval(this.interval);
                this.interval = null;
            },
        },
        data() {
            return {
                blockAmount: '...',
                currentBlock: '...',
                account: null,
                currentOffer: null,
                maxBTCInblock: null,
                interval: null,
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

    .dots:after {
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        -webkit-animation: ellipsis steps(4, end) 900ms infinite;
        animation: ellipsis steps(4, end) 1800ms infinite;
        content: '\2026'; /* ascii code for the ellipsis character */
        width: 0px;
    }

    @keyframes ellipsis {
        to {
            width: 20px;
        }
    }

    @-webkit-keyframes ellipsis {
        to {
            width: 20px;
        }
    }
</style>

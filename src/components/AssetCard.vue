<template>
    <v-card
        class="asset_card pa-0 mb-2"
        :class="{
            blue: balance.asset_code === 'BTC',
            accent: balance.asset_code === 'TFT',
            'white--text':
                balance.asset_code === 'BTC' || balance.asset_code === 'TFT',
        }"
    >
        <v-row>
            <v-col
                :cols="shouldShowExtra ? 6 : 12"
                class="pl-4"
                @click.stop="$emit('showDetails')"
            >
                <v-card-text class="pa-2">
                    <h1>
                        {{ balance.asset_code }}
                    </h1>
                    <div class="subtitle-1">
                        Balance {{ balance.balance | formatBalance }}
                    </div>
                    <div class="subtitle-2" v-if="lockedBalance">
                        Locked {{ lockedBalance | formatBalance }}
                    </div>
                </v-card-text>
            </v-col>
            <v-col
                cols="6"
                v-if="shouldShowExtra"
                class="pr-6"
                align-self="center"
            >
                <v-btn
                    v-if="shouldShowDeposit"
                    color="white"
                    style="color: #0972b8"
                    @click.stop="$emit('deposit')"
                    elevation="0"
                    block
                >
                    deposit
                </v-btn>
                <v-btn
                    v-if="shouldShowBuy"
                    color="white"
                    style="color: var(--accent-color)"
                    @click.stop="$emit('buy')"
                    elevation="0"
                    block
                >
                    Buy
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'AssetCard',
        props: {
            balance: { required: true },
            lockedBalance: { required: false },
            id: { required: true },
        },
        data() {
            return {
                address: '...',
            };
        },
        mounted() {
            if (this.balance.asset_code !== 'BTC') {
                return;
            }
            axios
                .get(
                    `https://cryptoanchor.io/stellar/deposit?asset_code=BTC&account=${this.id}`,
                    {}
                )
                .then(response => {
                    this.address = response.data.how;
                });
        },
        computed: {
            shouldShowExtra() {
                return this.shouldShowDeposit || this.shouldShowBuy;
            },
            shouldShowDeposit() {
                return (
                    this.balance.asset_code === 'BTC' &&
                    this.balance.balance <= 100
                );
            },
            shouldShowBuy() {
                //@todo: enable when buying should be enabled
                // return false;
                return this.balance.asset_code === 'TFT';
            },
        },
    };
</script>

<style scoped>
    .deposit {
        border-left: 2px solid #00000008;
        border-radius: 0;
    }
</style>

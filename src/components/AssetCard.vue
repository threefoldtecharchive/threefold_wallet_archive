<template>
    <v-card
        class="asset_card pa-0 mb-2"
        :class="{
            blue: balance.asset_code === 'BTC',
            accent: balance.asset_code === 'TFT',
            'white--text': balance.asset_code === 'BTC' || balance.asset_code === 'TFT',
        }"
    >
        <v-row>
            <v-col :cols="shouldShowExtra ? 6 : 12" class="pl-4" @click.stop="$emit('showDetails')">
                <v-card-text class="pa-2">
                    <h1>
                        {{ balance.asset_code }}
                    </h1>
                    <div class="subtitle-1">Balance {{ balance.balance | formatBalance }}</div>
                    <div class="subtitle-2" v-if="lockedBalance">Locked {{ lockedBalance | formatBalance }}</div>
                    <div class="subtitle-2" v-if="vestedBalance">Vested {{ vestedBalance | formatBalance }}</div>
                </v-card-text>
            </v-col>
            <v-col
                cols="6"
                v-if="shouldShowExtra"
                class="pr-6 pa-4"
                align-self="center"
                style="display: grid; gap: 0.5rem"
            >
                <v-btn
                    v-if="shouldShowTrade"
                    color="white"
                    style="color: #0972b8; font-size: 12px"
                    @click.stop="$emit('buy')"
                    elevation="0"
                    block
                    :text="shouldShowDeposit"
                >
                    Trade BTC to TFT
                    <v-icon x-small right v-if="shouldShowDeposit">fa-chevron-right </v-icon>
                </v-btn>
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
                    :text="shouldShowVest"
                >
                    Buy
                    <v-icon x-small right v-if="shouldShowVest">fa-chevron-right </v-icon>
                </v-btn>
                <v-btn
                    v-if="shouldShowVest"
                    color="white"
                    style="color: var(--accent-color)"
                    @click.stop="$emit('vest')"
                    elevation="0"
                    block
                >
                    Vest
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
            vestedBalance: { required: false },
            account: { required: true },
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
                .get(`https://cryptoanchor.io/stellar/deposit?asset_code=BTC&account=${this.account.id}`, {})
                .then(response => {
                    this.address = response.data.how;
                });
        },
        computed: {
            shouldShowExtra() {
                return this.shouldShowDeposit || this.shouldShowBuy || this.shouldShowVest || this.shouldShowTrade;
            },
            shouldShowDeposit() {
                return this.balance.asset_code === 'BTC';
            },
            shouldShowBuy() {
                return false;
                return (
                    this.balance.asset_code === 'TFT' &&
                    this.account.balances.find(b => b.asset_code === 'BTC')?.balance >= 0.00001
                );
            },
            shouldShowTrade() {
                return (
                    this.balance.asset_code === 'BTC' &&
                    this.account.balances.find(b => b.asset_code === 'BTC')?.balance >= 0.00001
                );
            },
            shouldShowVest() {
                return this.balance.asset_code === 'TFT' && this.balance.balance > 0;
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

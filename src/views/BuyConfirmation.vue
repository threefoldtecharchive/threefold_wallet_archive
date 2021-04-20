<template>
    <div class="Buy pa-4 fill-height flex-column">
        <v-card v-if="tradeInfo">
            <v-card-title> <h1>Buy Confirmation</h1> </v-card-title>
            <v-card-text>
                <span
                    >"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.</span
                >
                <br />
                {{ (1 / tradeInfo.price).toPrecision(8) }}
                <br />
                <pre class="px-4" style="white-space: pre-wrap; width: 100%">{{ tradeInfo }}</pre>
            </v-card-text>
            <v-card-actions class="flex-column">
                <v-btn class="mb-2" @click="onAgreeClick" block color="accent" elevation="0">agree</v-btn>
                <v-btn @click="$router.push({ name: 'home' })" block text color="error" elevation="0">cancel</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { helloWorld } from '@jimber/stellar-crypto';

    export default {
        name: 'BuyConfirmation',
        mounted() {
            if (!this.tradeInfo) {
                this.$router.push({ name: 'home' });
            }
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

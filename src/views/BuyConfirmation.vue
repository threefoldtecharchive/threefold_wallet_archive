<template>
    <div class="Buy pa-4 fill-height flex-column">
        <h1>buy confirmation</h1>

        <span
            >"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.</span
        >
        {{ (1 / tradeInfo.price).toPrecision(8) }}

        <pre class="px-4" style="white-space: pre-wrap; width: 100%">{{ tradeInfo }}</pre>
        <v-btn @click="onAgreeClick" accent>agree</v-btn>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { helloWorld } from '@jimber/stellar-crypto';

    export default {
        name: 'BuyConfirmation',
        beforeMount() {
            if (!this.tradeInfo) this.$router.push({ name: 'home' });
            helloWorld();
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

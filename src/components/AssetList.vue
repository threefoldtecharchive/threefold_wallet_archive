<template>
    <v-col class="asset-list">
        <OpenOfferCard v-for="offer in offers" :key="offer.id" :offer="offer" :account="account" />
        <AssetCard
            v-for="balance in account.balances"
            v-bind:key="balance.asset_code"
            v-on:showDetails="$emit('showDetails', balance.asset_code)"
            v-on:buy="
                $router.push({
                    name: 'buy',
                    params: {
                        account: account.id,
                        asset_code: balance.asset_code,
                    },
                })
            "
            v-on:deposit="
                $router.push({
                    name: 'deposit',
                    params: {
                        account: account.id,
                        asset_code: balance.asset_code,
                    },
                })
            "
            v-on:vest="$emit('vest')"
            :balance="balance"
            :locked-balance="account.lockedBalances[balance.asset_code]"
            :vested-balance="balance.asset_code === 'TFT' ? account.vestedBalance : 0"
            :account="account"
        />
        <ActivatCard
            v-if="!account.balances.find(b => b.asset_code === 'BTC') && currencies.indexOf('BTC') !== -1"
            asset="BTC"
            class="lighten-1 grey theme--dark"
            :account="account"
        />
    </v-col>
</template>
<script>
    import AssetCard from '@/components/AssetCard.vue';
    import ActivatCard from '@/components/ActivateCard';
    import { mapGetters } from 'vuex';
    import { getConfig } from '@jimber/stellar-crypto';
    import { Asset } from 'stellar-base';
    import { ServerApi } from 'stellar-sdk';
    import OpenOfferCard from '@/components/OpenOfferCard';

    export default {
        name: 'AssetList',
        components: { OpenOfferCard, ActivatCard, AssetCard },
        props: {
            account: {},
        },
        mounted() {
            this.checkForOpenOffers(this.account.id);
        },

        methods: {
            async checkForOpenOffers(id) {
                const { /**@type {Server}*/ server, currencies } = getConfig();
                const BTC = new Asset('BTC', currencies['BTC'].issuer);
                const TFT = new Asset('TFT', currencies['TFT'].issuer);
                /** @type {ServerApi.CollectionPage<ServerApi.OfferRecord>} */
                const offers = await server.offers().forAccount(id).selling(BTC).buying(TFT).call();
                this.offers = offers.records;
            },
        },

        computed: {
            ...mapGetters(['currencies']),
        },
        data() {
            return {
                offers: [],
            };
        },
    };
</script>
<style scoped lang="scss">
    header {
        background: lighten(#2d4052, 20);
        color: white;
    }

    @media screen and (max-width: 600px) {
    }

    @media screen and (min-width: 960px) {
    }

    .asset-list {
        padding-bottom: 124px;
    }

    .asset-list:after {
        display: block;
        content: '';
        position: fixed;
        bottom: 0;
        left: 0;
        background: linear-gradient(#00000000, #ffffff);
        width: 100%;
        height: 130px;
        pointer-events: none;
    }
</style>

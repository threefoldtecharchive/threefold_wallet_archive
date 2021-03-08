<template>
    <v-col class="asset-list">
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
            :balance="balance"
            :locked-balance="account.lockedBalances[balance.asset_code]"
            :id="account.id"
        />
        <ActivatCard
            v-if="!account.balances.find(b => b.asset_code === 'BTC')"
            asset="BTC"
            class="grey theme--dark"
            :account="account"
        />
    </v-col>
</template>
<script>
    import AssetCard from '@/components/AssetCard.vue';
    import ActivatCard from '@/components/ActivateCard';

    export default {
        name: 'AssetList',
        components: { ActivatCard, AssetCard },
        props: {
            account: {},
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

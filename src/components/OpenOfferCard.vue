<template>
    <v-card class="activate_card pa-0 mb-2">
        <v-card-title> Open Trade Offer</v-card-title>
        <v-card-text class="d-flex justify-space-between align-center"
            ><span class="offer-text"
                ><b>Sell</b> {{ Number(offer.amount).toFixed(4) }} <b>{{ offer.selling.asset_code }}</b> <b>for</b>
                {{ (Number(offer.price) * Number(offer.amount)).toFixed(4) }}
                <b>{{ offer.buying.asset_code }}</b></span
            >
            <div>
                <v-btn icon color="error" @click="handleRemove">
                    <v-icon>fa-trash</v-icon>
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import { closeTradeOffer } from '@jimber/stellar-crypto';
    import { mapMutations } from 'vuex';

    export default {
        name: 'OpenOfferCard',
        props: {
            offer: { required: true },
            account: { required: true },
        },
        methods: {
            ...mapMutations(['startAppLoading', 'stopAppLoading', 'setLoadingMessage']),
            async handleRemove() {
                // Add dialog
                this.startAppLoading();
                this.setLoadingMessage({ message: 'Removing offer' });

                await closeTradeOffer(this.account.keyPair, Number(this.offer.id));

                await this.$router.go(this.$router.currentRoute);
                this.stopAppLoading();
            },
        },
    };
</script>

<style scoped lang="scss">
    .offer-text {
        font-size: 16px;
    }
</style>

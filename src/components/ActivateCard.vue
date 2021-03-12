<template>
    <v-card class="activate_card pa-0 mb-2">
        <v-card-text class="d-flex justify-space-between align-center">
            <h1 style="color: #fff">
                {{ asset }}
            </h1>
            <v-btn color="accent" @click="activateAsset" elevation="0">
                Activate
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
    import { getConfig } from '@jimber/stellar-crypto';
    import { Asset, Operation, TransactionBuilder } from 'stellar-base';

    export default {
        name: 'ActivatCard',
        props: {
            asset: { required: true },
            account: { required: true },
        },
        methods: {
            activateAsset() {
                // this.selfActivateAsset();
                this.$router.push({
                    name: 'activate',
                    params: {
                        account: this.account.id,
                        asset: this.asset,
                    },
                });
            },
        },
    };
</script>

<style scoped></style>

<template>
    <v-card class="activate_card pa-0 mb-2">
        <v-row>
            <v-col cols="6">
                <v-card-text class="pa-2">
                    <h1>
                        {{ asset }}
                    </h1>
                </v-card-text>
            </v-col>
            <v-col cols="6" class="pr-6">
                <v-btn
                    color="accent"
                    height="100%"
                    @click="activateAsset"
                    block
                    elevation="0"
                >
                    Activate
                </v-btn>
            </v-col>
        </v-row>
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

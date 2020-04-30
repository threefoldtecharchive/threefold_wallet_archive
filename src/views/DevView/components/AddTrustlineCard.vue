<template>
    <v-card>
        <v-card-text>
            <p class="display-1 text--primary">
                Add trustline
            </p>
            <v-select
                :items="accounts"
                item-text="name"
                return-object
                label="Account"
                hint="select account to add trustlines to"
                persistent-hint
                v-model="account"
            ></v-select>
            <v-select
                :items="Object.keys(currencies)"
                label="asset_code"
                multiple
                hint="select trustlines to add"
                persistent-hint
                v-model="assetCodes"
            ></v-select>
        </v-card-text>
        <v-card-actions>
            <v-btn dark text color="deep-purple" @click="addTrustLines">
                addtrustlines
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    import { mapGetters } from 'vuex';
    import config from '../../../../public/config';
    import { Server } from 'stellar-sdk';

    export default {
        name: 'addTrustlineCard',
        computed: {
            ...mapGetters(['accounts']),
            currencies: config.currencies
        },
        data: function () {
            return { account: null, assetCodes: null };
        },
        methods: {
            assetCodeValue(...args) {
                console.log(args);
            },
            addTrustLines() {
                //@todo: implement this
            }
        }
    };
</script>

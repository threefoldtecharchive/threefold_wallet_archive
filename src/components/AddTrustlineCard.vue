<template>
    <v-card>
        <v-card-title>
            Add threefold trustlines
        </v-card-title>
        <v-card-text>
            <v-col>
                <v-row>
                    Available trustlines:
                    <span
                        class="ml-1"
                        v-for="currency in currencies"
                        :key="currency"
                    >
                        {{ currency }}
                    </span>
                </v-row>
                <v-row v-for="account in accounts" :key="account.id">
                    {{ account.name }}
                    <v-spacer></v-spacer>
                    <v-btn
                        x-small
                        dark
                        text
                        color="deep-purple"
                        @click="addTrustLines(account)"
                        >Add Threefold trustlines</v-btn
                    >
                </v-row>
            </v-col>
        </v-card-text>
        <!--
        <v-card-actions>
            <v-btn dark text color="deep-purple" @click="addTrustLines">
                addtrustlines
            </v-btn>
        </v-card-actions> -->
    </v-card>
</template>
<script>
    import { mapGetters } from 'vuex';
    import config from '@/../public/config';
    import { Server } from 'stellar-sdk';
    import { addTrustLine } from '@jimber/stellar-crypto';

    export default {
        name: 'addTrustlineCard',
        computed: {
            ...mapGetters(['accounts', 'currencies']),
        },
        data: function () {
            return { account: null, assetCodes: null };
        },
        methods: {
            addTrustLines(account) {
                console.log(account);
                addTrustLine(account.keyPair);
            },
        },
    };
</script>

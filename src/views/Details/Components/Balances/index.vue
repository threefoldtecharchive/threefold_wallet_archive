<template>
    <v-col>
        <v-card v-for="(balance, i) in balances" :key="i">
            <h1>{{ balance.asset_code || 'XLM' }}</h1>
            <h2>{{ balance.balance }}</h2>
        </v-card>
    </v-col>
</template>

<script>
    export default {
        data: function () {
            return {};
        },
        props: {
            balances: {
                type: Array,
            },
        },
    };
</script>

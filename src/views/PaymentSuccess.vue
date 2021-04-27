<template>
    <div class="view fill-height">
        <v-card class="pa-2 fill-height" style="width: 100%">
            <v-card-title> PaymentSuccess </v-card-title>
            <v-card-text> you can close the wallet </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'PaymentSuccess',
    };
</script>

<style scoped>
    .view {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

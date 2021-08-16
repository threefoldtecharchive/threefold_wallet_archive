<template>
    <div class="fill-height pa-4">
        <v-card>
            <v-card-title>
                <h3>Payment (<span class="success--text">success</span>)</h3>
            </v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center pb-6">
                <div class="pt-4">
                    <img alt="" height="200" src="/undraw_My_universe_re_txot.svg" />
                </div>
                <div class="caption layout justify-center mt-4">
                    <h2>Please navigate to the Reserve DigitalTwin page</h2>
                </div>
            </v-card-text>
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

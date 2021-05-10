<template>
    <div class="Withdraw fill-height pa-4">
        <v-card>
            <v-card-title>
                <h3>Send BTC to</h3>
            </v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center">
                <div class="status pb-2">
                    To withdraw your BTC, please use the manual procedure provided
                    <a class="font-weight-bold v-size--large" @click="showManual = true"> here</a>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn elevation="0" color="error" text style="text-align: right" @click="$router.back()">
                    cancel
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="showManual" fullscreen>
            <v-card>
                <v-card-title>
                    <v-row>
                        Manual
                        <v-spacer></v-spacer>
                        <v-btn icon @click="showManual = false">
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-row>
                </v-card-title>
                <iframe
                    style="height: calc(100vh - 62px); width: 100%"
                    src="https://threefold.io/info/threefold#/legal__terms_conditions_griduser"
                    frameborder="0"
                ></iframe>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';

    export default {
        name: 'Withdraw',
        data() {
            return {
                account: null,
                showManual: false,
            };
        },
        beforeMount() {
            this.account = store.getters.accounts.find(x => x.id === this.$route.params.account);
            if (!this.account) {
                router.push({ name: 'error screen' });
                return;
            }
        },
    };
</script>

<style scoped>
    .Withdraw {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

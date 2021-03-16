<template>
    <div class="Vesting pa-4 fill-height">
        <v-card class="pa-4">
            <h2>account: {{ account.name }}</h2>
            <v-text-field
                v-model.number="btcAmount"
                persistent-hint
                label="BTC"
            ></v-text-field>
            <div class="btns">
                <v-btn
                    class="pa-1 mr-2"
                    small
                    elevation="0"
                    color="#e0e0e0"
                    @click="
                        btcAmount =
                            account.balances.find(b => b.asset_code === 'BTC')
                                .balance * 0.25
                    "
                    >25%
                </v-btn>
                <v-btn
                    class="pa-1 mr-2"
                    small
                    elevation="0"
                    color="#e0e0e0"
                    @click="
                        btcAmount =
                            account.balances.find(b => b.asset_code === 'BTC')
                                .balance * 0.5
                    "
                    >50%
                </v-btn>
                <v-btn
                    class="pa-1 mr-2"
                    small
                    elevation="0"
                    color="#e0e0e0"
                    @click="
                        btcAmount =
                            account.balances.find(b => b.asset_code === 'BTC')
                                .balance * 0.75
                    "
                    >75%
                </v-btn>
                <v-btn
                    class="pa-1 mr-2"
                    small
                    elevation="0"
                    color="#e0e0e0"
                    @click="
                        btcAmount = account.balances.find(
                            b => b.asset_code === 'BTC'
                        ).balance
                    "
                    >100%
                </v-btn>
            </div>
            <v-text-field
                :value="Math.round(btcAmount * 33691.77 * 10)"
                persistent-hint
                disabled
                color="black"
                label="TFT"
                hint="minimum amount of of tft you will get"
            ></v-text-field>
            <v-btn color="accent" block elevation="0"
                >Submit this buy order
            </v-btn>
        </v-card>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';

    export default {
        name: 'Vesting',

        beforeMount() {
            this.account = store.getters.accounts.find(
                x => x.id === this.$route.params.account
            );
            if (!this.account) {
                router.push({ name: 'error screen' });
                return;
            }

            if (!this.account.balances.find(b => b.asset_code === 'BTC')) {
                this.$router.push({
                    name: 'activate',
                    params: {
                        account: this.account.id,
                        asset: 'BTC',
                    },
                });

                this.$flashMessage.error(
                    `BTC is not yet activated, please activate it before continuing.`
                );

                return;
            }
        },
        data() {
            return {
                account: null,
                btcAmount: 1,
            };
        },
    };
</script>

<style scoped>
    .Vesting {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<template>
    <div class="Deposit fill-height pa-4">
        <v-card v-if="false">
            <v-card-title>
                <h3>Deposit BTC</h3>
            </v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center">
                <div class="caption layout justify-center">
                    <span>
                        Send BTC to the following address by clicking the copy icon or scanning the QR code below.
                    </span>
                </div>
                <CopyField
                    :message="`Successfully copied address to clipboard.`"
                    :value="address"
                    label="BTC Wallet Address"
                    title="Copy address to clipboard"
                />
                <qrcode
                    v-if="address !== '...'"
                    :options="{
                        color: {
                            darklight: '#fff',
                            dark: $vuetify.theme.primary,
                        },
                    }"
                    :value="`bitcoin:${address}`"
                />
                <img v-if="address === '...'" alt="" height="148" src="/loading.gif" width="148" />
                <div class="caption layout justify-center">
                    <span> Minimum transaction amount: {{ min_amount }} BTC </span>
                </div>
                <div class="caption layout justify-center">
                    <span>A fee of around 0.0001 BTC will be applied on deposit. </span>
                </div>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-title>
                <h3>Deposit BTC (<span class="error--text">disabled</span>)</h3>
            </v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center">
                <div class="caption layout justify-center">
                    <h2>We are investigating issues with BTC Deposits.</h2>
                </div>
                <div class="pt-4">
                    <img alt="" height="200" src="/undraw_searching_p5ux.svg" />
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';
    import { getDepositAddress } from '@/services/DepositService';
    import CopyField from '@/components/CopyField.vue';
    import qrcode from '@chenfengyuan/vue-qrcode';

    export default {
        name: 'Deposit',
        components: {
            CopyField,
            qrcode,
        },
        data() {
            return {
                address: '...',
                min_amount: 0.00018798,
                account: null,
            };
        },
        beforeMount() {
            this.account = store.getters.accounts.find(x => x.id === this.$route.params.account);
            if (!this.account) {
                router.push({ name: 'error screen' });
                return;
            }
        },
        mounted() {
            getDepositAddress(this.account.id).then(data => {
                console.log({ data });
                this.address = data.how;
                this.min_amount = data.min_amount;
            });
        },
    };
</script>

<style scoped>
    .Deposit {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

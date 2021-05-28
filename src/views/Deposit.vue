<template>
    <div class="Deposit fill-height pa-4">
        <v-card>
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
                    label="BTC Wallet Address"
                    :value="address"
                    :message="`Successfully copied address to clipboard.`"
                    title="Copy address to clipboard"
                />
                <qrcode
                    v-if="address !== '...'"
                    :value="`bitcoin:${address}`"
                    :options="{
                        color: {
                            darklight: '#fff',
                            dark: $vuetify.theme.primary,
                        },
                    }"
                />
                <img height="148" width="148" v-if="address === '...'" src="/loading.gif" alt="" />
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
            getDepositAddress(this.account.id).then(address => (this.address = address));
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

<template>
    <div class="Deposit fill-height pa-4">
        <v-card>
            <v-card-title>
                <h3>Send btc to</h3>
            </v-card-title>
            <v-card-text class="d-flex flex-column justify-center align-center">
                <div class="status">
                    Btc status on your account :
                    <b
                        class="green--text"
                        v-if="
                            account.balances.find(b => b.asset_code === 'BTC')
                        "
                    >
                        ok
                    </b>
                    <b class="red--text" v-else> not ok </b>
                </div>
                <CopyField
                    label="BTC address"
                    :value="address"
                    :message="`Btc address has been copied to clipboard (${address.substring(
                        0,
                        8
                    )}...).`"
                    title="Copy address to clipboard"
                />
                <qrcode
                    :value="`bitcoin:${address}`"
                    :options="{
                        color: {
                            darklight: '#fff',
                            dark: $vuetify.theme.primary,
                        },
                    }"
                />
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
            this.account = store.getters.accounts.find(
                x => x.id === this.$route.params.account
            );
            if (!this.account) {
                router.push({ name: 'error screen' });
                return;
            }
        },
        mounted() {
            getDepositAddress(this.account.id).then(
                address => (this.address = address)
            );
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

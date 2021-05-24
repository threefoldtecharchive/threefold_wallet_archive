<template>
    <section class="qr-dialog">
        <v-dialog v-model="dialog" fullscreen persistent scrollable>
            <v-card class="no-radius">
                <v-card-title
                    style="background-color: #34495e; color: white;"
                    dense
                >
                    Show QR to sender
                    <v-spacer></v-spacer>
                    <v-btn text icon @click="closeDialog(false)">
                        <v-icon :color="$route.meta.accent">
                            fas fa-times
                        </v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pt-2">
                    <div class="px-2">
                        <v-layout justify-space-between fill-height column px-2>
                            <p class="subtitle mb-0 grey--text">To</p>
                            <AccountCard
                                no-padding
                                class="my-2"
                                :displayAmount="false"
                                :account="selectedAccount"
                            />
                            <v-flex>
                                <p class="subtitle mb-0 grey--text">Amount</p>
                                <p class="title mt-0">
                                    {{ formObject.amount | formatBalance }}
                                    {{ selectedCurrency }}
                                </p>
                            </v-flex>
                            <v-flex v-if="formObject.message">
                                <p class="subtitle mb-0 grey--text">Memo Text</p>
                                <p class="title mt-0">
                                    {{ formObject.message }}
                                </p>
                            </v-flex>
                        </v-layout>
                        <v-row justify="center">
                            <qrcode
                                :value="qrText"
                                v-if="selectedTab == 0"
                                class="round"
                                :options="{
                                    color: {
                                        darklight: '#fff',
                                        dark: $vuetify.theme.primary,
                                    },
                                }"
                            />
                        </v-row>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>
<script>
    import qrcode from '@chenfengyuan/vue-qrcode';
    import AccountCard from './AccountCard';
    export default {
        name: 'qr-dialog',
        components: {
            qrcode,
            AccountCard,
        },
        props: {
            dialog: {
                type: Boolean,
                default: false,
            },
            closeDialog: {
                type: Function,
            },
            formObject: {
                type: Object,
                default: () => {},
            },
            selectedTab: {
                type: Number,
            },
            selectedAccount: {
                type: Object,
            },
            selectedCurrency: {
                type: String,
            },
        },
        computed: {
            qrText() {
                // return { tft: '01ed90bee1d6d50b730a1aacf2890ac6fc0f7718849fba5f7c5719e3cfcc4641be09c5607b0210', amount: 0 }
                return `${this.selectedCurrency}:${
                    this.selectedAccount.id
                }?amount=${Number(this.formObject.amount).toFixed(7)}&message=${
                    this.formObject.message
                }&sender=me`;
            },
        },
    };
</script>
<style scoped lang="scss"></style>

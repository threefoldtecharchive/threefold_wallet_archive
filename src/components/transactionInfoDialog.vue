<template>
    <section class="transaction-info-dialog">
        <v-dialog v-model="dialog" fullscreen persistent scrollable>
            <v-card class="no-radius">
                <v-card-title
                    style="background-color: #34495e; color: white;"
                    dense
                >
                    <span v-if="isValidBtcAddress">
                        Withdraw BTC info
                    </span>
                    <span v-else>
                        Transaction info
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn text icon @click="closeDialog(false)">
                        <v-icon :color="$route.meta.accent">
                            fas fa-times
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-layout fill-height column>
                        <!-- {{selectedAccount}} -->
                        <v-layout justify-space-between fill-height column>
                            <p class="subtitle mb-0 mt-2 grey--text">From</p>
                            <accountCard
                                no-padding
                                class="my-2"
                                :account="selectedAccount"
                            />

                            <p class="subtitle mb-0 grey--text">To</p>
                            <accountCard
                                v-if="toAccountIsOwn"
                                no-padding
                                class="my-2"
                                :account="toAccountIsOwn"
                            />
                            <p v-else class="title mt-0 text-truncate">
                                {{ formObject.to.address }}
                            </p>

                            <p class="subtitle mb-0 grey--text">Amount</p>
                            <v-layout class="pb-2" justify-space-between>
                                <span class="title mt-0"
                                    >{{ amount | formatBalance }}
                                    {{ selectedCurrency }}</span
                                >
                                <span
                                    class="text-xs-right caption"
                                    v-if="selectedCurrency !== 'BTC'"
                                    >{{ 0.1 }} {{ selectedCurrency }} fee
                                    included</span
                                >
                            </v-layout>
                            <template v-if="formObject.message">
                                <p class="subtitle mb-0 grey--text">Message</p>
                                <p class="title mt-0">
                                    {{ formObject.message }}
                                </p>
                            </template>
                        </v-layout>
                    </v-layout>
                    <v-btn
                        @click="closeDialog(true)"
                        dark
                        :color="$route.meta.accent"
                        style="margin-left: 0px; margin-right: 0px;"
                        block
                    >
                        Confirm
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>
<script>
    import accountCard from './AccountCard';
    import { mapGetters } from 'vuex';
    import validate from 'bitcoin-address-validation';

    export default {
        name: 'transaction-info-dialog',
        components: { accountCard },
        props: {
            dialog: {
                type: Boolean,
            },
            closeDialog: {
                type: Function,
            },
            send: {
                type: Function,
            },
            selectWallet: {
                type: Function,
            },
            accounts: {
                type: Array,
                default: () => [],
            },
            selectedAccount: {
                type: Object,
                default: () => {},
            },
            formObject: {
                type: Object,
                default: () => {},
            },
            selectedCurrency: {
                type: String,
            },
        },
        mounted() {
            var field = document.createElement('input');
            field.setAttribute('type', 'text');
            document.body.appendChild(field);

            setTimeout(function () {
                field.focus();
                setTimeout(function () {
                    field.setAttribute('style', 'display:none;');
                }, 50);
            }, 50);
        },
        computed: {
            ...mapGetters(['fee']),
            amount() {
                if (this.$route.query.tab == 'receive') {
                    return Number(this.formObject.amount);
                }
                if (this.selectedCurrency === 'BTC') {
                    return Number(this.formObject.amount);
                }

                return Number(this.formObject.amount) + Number(this.fee / 1000);
            },
            toAccountIsOwn() {
                return this.accounts.find(
                    x =>
                        x.id.toLowerCase() ==
                        this.formObject.to.address.toLowerCase()
                );
            },
            isValidBtcAddress() {
                return validate(this.formObject.to.address, 'mainnet');
            },
        },
    };
</script>
<style scoped lang="scss"></style>

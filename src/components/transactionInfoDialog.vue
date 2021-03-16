<template>
    <section class="transaction-info-dialog">
        <v-dialog v-model="dialog" fullscreen persistent scrollable>
            <v-card class="no-radius">
                <v-card-title
                    style="background-color: #34495e; color: white"
                    dense
                >
                    <span v-if="isValidBtcAddress"> Withdraw BTC info </span>
                    <span v-else> Transaction info </span>
                    <v-spacer></v-spacer>
                    <v-btn text icon @click="closeDialog(false)">
                        <v-icon :color="$route.meta.accent">
                            fas fa-times
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text style="background-color: #f5f5f5 !important">
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

                            <template v-if="formObject.message">
                                <p class="subtitle mb-0 grey--text">Message</p>
                                <p class="title mt-0">
                                    {{ formObject.message }}
                                </p>
                            </template>
                            <template v-if="calcultaingFee">
                                <p class="subtitle mb-0 grey--text">Amount</p>
                                <v-layout class="pb-2" justify-space-between>
                                    <v-skeleton-loader
                                        class="mt-2 d-inline-block"
                                        type="text"
                                        width="56"
                                    ></v-skeleton-loader>
                                    <span class="text-xs-right caption"
                                        >calculating fee ...</span
                                    >
                                </v-layout>
                            </template>
                            <template v-else>
                                <p class="subtitle mb-0 grey--text">Amount</p>
                                <v-layout class="pb-2" justify-space-between>
                                    <span class="title mt-0"
                                        >{{ amount | formatBalance }}
                                        {{ selectedCurrency }}</span
                                    >
                                    <span class="text-xs-right caption"
                                        >{{ fee }} {{ selectedCurrency }} fee
                                        included</span
                                    >
                                </v-layout>
                            </template>

                            <div class="action">
                                <v-btn
                                    @click="closeDialog(true)"
                                    color="accent"
                                    style="margin-left: 0px; margin-right: 0px"
                                    block
                                    :disabled="true"
                                >
                                    Confirm
                                </v-btn>
                            </div>
                        </v-layout>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>
<script>
    import accountCard from './AccountCard';
    import { mapGetters } from 'vuex';
    import validate from 'bitcoin-address-validation';
    import { fetchFundDetails, getConfig } from '@jimber/stellar-crypto';
    import { Asset } from 'stellar-base';

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
            const { currencies } = getConfig();
            const asset = new Asset(
                this.selectedCurrency,
                currencies[this.selectedCurrency].issuer
            );
            fetchFundDetails(asset).then(condition => {
                this.fee = condition.fee_fixed;
                this.calcultaingFee = false;
            });

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
        data() {
            return {
                fee: null,
                calcultaingFee: true,
            };
        },
        computed: {
            amount() {
                if (this.$route.query.tab == 'receive') {
                    return Number(this.formObject.amount);
                }
                if (this.selectedCurrency === 'BTC') {
                    return Number(this.formObject.amount);
                }

                return Number(this.formObject.amount) + Number(this.fee);
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

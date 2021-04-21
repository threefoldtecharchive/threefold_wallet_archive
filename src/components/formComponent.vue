<template>
    <section class="form-component">
        <v-form ref="form" v-model="valid">
            <v-text-field
                dense
                v-if="selectedTab == 1"
                :label="selectedCurrency === 'BTC' ? 'To (BTC or Wallet Address)' : 'To (Wallet Address)'"
                v-model="formObject.to.address"
                :rules="toRules"
                append-icon="far fa-address-book"
                @click:append="toDialog = true"
                clearable
                ref="toField"
            >
            </v-text-field>

            <v-text-field
                dense
                label="Amount"
                v-model="formObject.amount"
                type="number"
                min="0.00"
                :rules="amountRules"
                class="inputNumber mb-0"
                clearable
                :suffix="selectedCurrency"
            >
            </v-text-field>
            <div class="btns" v-if="isSend">
                <v-btn class="pa-1 mr-2" small elevation="0" color="#e0e0e0" @click="setAmount(0.25)">25%</v-btn>
                <v-btn class="pa-1 mr-2" small elevation="0" color="#e0e0e0" @click="setAmount(0.5)">50%</v-btn>
                <v-btn class="pa-1 mr-2" small elevation="0" color="#e0e0e0" @click="setAmount(0.75)">75%</v-btn>
                <v-btn class="pa-1 mr-2" small elevation="0" color="#e0e0e0" @click="setAmount(1)">100%</v-btn>
            </div>

            <v-text-field
                label="Message"
                v-if="!isBtcAddress"
                v-model="formObject.message"
                :rules="messageRules"
                :counter="maxMessageLength"
                clearable
                :maxlength="maxMessageLength"
            >
            </v-text-field>

            <ToDialog
                v-if="toDialog"
                ref="toDialog"
                :dialog="toDialog"
                :closeDialog="closetoDialog"
                :selectedAccount="selectedAccount"
                :accounts="accounts"
                :toRules="toRules"
            ></ToDialog>
        </v-form>
    </section>
</template>
<script>
    import ToDialog from './toDialog.vue';
    import { mapGetters } from 'vuex';
    import validate from 'bitcoin-address-validation';

    export default {
        name: 'form-component',
        components: {
            ToDialog,
        },
        props: {
            formObject: {
                type: Object,
                default: () => {},
            },
            selectedTab: {
                type: Number,
            },
            accounts: {
                type: Array,
                default: () => [],
            },
            selectedAccount: {
                type: Object,
                default: () => {},
            },
            fee: {
                type: Number,
                required: true,
            },
            selectedCurrency: {
                type: String,
                default: 'TFT',
            },
            isBtcAddress: {
                type: Boolean,
            },
            isSend: {
                type: Boolean,
            },
        },
        data() {
            return {
                maxMessageLength: 28,
                toDialog: false,
                valid: false,
                tooltip: false,
            };
        },
        computed: {
            ...mapGetters(['currencies']),
            toRules() {
                const rules = [
                    v => !!v || 'Wallet address is required!',
                    v =>
                        (!!v &&
                            ((v.length >= 56 && v.length <= 56) ||
                                (this.selectedCurrency === 'BTC' &&
                                    validate(this.formObject.to.address, 'mainnet')))) ||
                        'Wallet address length is not valid!',
                ];
                return rules;
            },
            messageRules() {
                const rules = [
                    // v => !!v || 'Message is required!',
                    v =>
                        typeof v == 'undefined' ||
                        (typeof v === 'string' && v.length <= this.maxMessageLength) ||
                        `Message cannot be more than ${this.maxMessageLength} characters long`,
                ];
                return rules;
            },
            amountRules() {
                const rules = [
                    v => !!v || 'The amount is required',
                    v => (!!v && Number(v) > 0) || 'The amount must be greater than 0',
                    // @TODO add this to validate the balance
                    // v => !!v && Number(v) <= Number((this.accounts.find(x => x.address == this.selectedWallet.address).totalAmount.replace(",", "") - 0.10).toFixed(9)) || 'Your balance is insufficient'
                ];
                return rules;
            },
        },
        mounted() {},
        methods: {
            closetoDialog(save, wallet) {
                if (save) {
                    this.formObject.to = wallet;
                }
                this.toDialog = false;
                this.$refs.toDialog.$refs.externForm.reset();
            },
            selectWallet(wallet) {
                this.formObject.to = {
                    name: wallet.name,
                    currency: wallet.currency,
                    address: wallet.address,
                    holder: wallet.holder,
                    totalAmount: wallet.totalAmount,
                };
            },
            setAmount(percentage) {
                console.log(Number(this.fee));
                console.log(
                    Number(this.selectedAccount.balances.find(b => b.asset_code === this.selectedCurrency).balance)
                );

                const availableBalanceWithoutfee =
                    Number(this.selectedAccount.balances.find(b => b.asset_code === this.selectedCurrency).balance) -
                    Number(this.fee);
                console.log(availableBalanceWithoutfee);
                const amount = availableBalanceWithoutfee * percentage;

                if (amount <= 0) {
                    this.$flashMessage.error('balance is too low');
                    return;
                }
                this.formObject.amount = amount;
            },
        },
    };
</script>
<style scoped lang="scss">
    .form-component {
    }

    .inputPrice input[type='number'] {
        -moz-appearance: textfield;
    }

    .inputPrice input::-webkit-outer-spin-button,
    .inputPrice input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
</style>

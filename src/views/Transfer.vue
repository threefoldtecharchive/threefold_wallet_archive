<template>
    <section class="transfer fill-height" ref="transfer">
        <div class="px-2">
            <div class="py-2">
                <div class="div-toggle-buttons layout justify-center">
                    <v-btn-toggle
                        dense
                        v-model="selectedTab"
                        mandatory
                        class="round"
                    >
                        <v-btn
                            text
                            v-for="tab in tabs"
                            :key="tab"
                            class="px-3 my-1 mx-1 round"
                            exact
                            :to="{ query: { tab: tab } }"
                            >{{ tab }}
                        </v-btn>
                    </v-btn-toggle>
                </div>
            </div>

            <div class="pa-2 pt-1 layout justify-end">
                <v-btn v-if="active === 'send'" small text @click="scanQR()">
                    Scan QR
                    <v-icon class="ml-2">fas fa-qrcode</v-icon>
                </v-btn>
                <v-btn
                    v-else
                    small
                    text
                    @click="scanQR()"
                    style="visibility: hidden"
                >
                </v-btn>
            </div>

            <v-row>
                <v-col>
                    <v-select
                        class="mt-1 pt-0"
                        :label="selectedTab === 1 ? 'From' : 'To'"
                        @change="selectAccount"
                        :items="availableAccounts"
                        v-model="selectedAccount"
                        v-if="availableAccounts.length"
                        return-object
                        append-icon="fas fa-caret-down"
                    >
                        <template v-slot:selection="data">
                            <div style="width: 100%; display: flex">
                                <span class="text-capitalize">{{
                                    data.item.name
                                }}</span>
                                <v-spacer></v-spacer>
                                {{
                                    balanceForCurrency(data.item.balances)
                                        | formatBalance
                                }}
                            </div>
                        </template>
                        <template v-slot:item="data">
                            <v-row class="text-capitalize">
                                {{ data.item.name }}
                                <v-spacer></v-spacer>
                                {{
                                    balanceForCurrency(data.item.balances)
                                        | formatBalance
                                }}
                            </v-row>
                        </template>
                    </v-select>
                    <v-select
                        v-else
                        class="mt-1 pt-0"
                        :label="selectedTab === 1 ? 'From' : 'To'"
                        :items="[`No ${selectedCurrency} balance`]"
                        :value="`No ${selectedCurrency} balance`"
                        disabled
                    >
                    </v-select>
                </v-col>
                <v-col cols="4">
                    <v-select
                        class="mt-1 pt-0"
                        label="Currency"
                        :items="
                            selectedAccount && selectedAccount.balances
                                ? selectedAccount.balances.map(
                                      b => b.asset_code
                                  )
                                : []
                        "
                        v-model="selectedCurrency"
                        item-value="TFT"
                        return-object
                        append-icon="fas fa-caret-down"
                        @change="
                            $nextTick(() =>
                                $refs.formComponent.$refs.toField.validate()
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>

            <FormComponent
                ref="formComponent"
                :formObject="formObject"
                :selectedTab="selectedTab"
                :accounts="accounts"
                :selectedAccount="selectedAccount"
                :selectedCurrency="selectedCurrency"
                :is-btc-address="isValidBtcAddress"
                :fee="fee"
            >
            </FormComponent>

            <v-row>
                <v-col>
                    <span
                        v-if="
                            $route.query.tab !== 'receive' &&
                            selectedCurrency !== 'BTC'
                        "
                        >Fee: {{ fee }} {{ selectedCurrency }}</span
                    >
                    <span
                        v-else-if="
                            $route.query.tab !== 'receive' &&
                            selectedCurrency === 'BTC'
                        "
                        >Fee: 0.0001 {{ selectedCurrency }}</span
                    >
                    <v-btn
                        class="mx-0 mt-3"
                        style="width: 100%"
                        color="accent"
                        @click="transferConfirmed"
                        :loading="
                            $route.query.tab === 'send' && !this.accountsReady
                        "
                        :disabled="
                            !formObject.amount ||
                            ($route.query.tab === 'send' && !this.accountsReady)
                        "
                    >
                        <div v-if="$route.query.tab === 'receive'">
                            Generate QR
                        </div>
                        <div v-if="$route.query.tab === 'send'">
                            {{
                                isValidBtcAddress
                                    ? 'Withdraw BTC'
                                    : 'Send Tokens'
                            }}
                        </div>
                    </v-btn>
                </v-col>
            </v-row>
        </div>

        <TransactionInfoDialog
            v-if="transactionInfoDialog"
            :dialog="transactionInfoDialog"
            :closeDialog="closeTransactionInfoDialog"
            :accounts="accounts"
            :send="send"
            :selectedAccount="selectedAccount"
            :selectedCurrency="selectedCurrency"
            :formObject="formObject"
        >
        </TransactionInfoDialog>

        <QrDialog
            v-if="qrDialog"
            :dialog="qrDialog"
            :closeDialog="closeQrDialog"
            :formObject="formObject"
            :selectedAccount="selectedAccount"
            :selectedCurrency="selectedCurrency"
            :selectedTab="selectedTab"
        ></QrDialog>
    </section>
</template>
<script>
    import FormComponent from '@/components/formComponent.vue';
    import QrDialog from '@/components/qrDialog.vue';
    import TransactionInfoDialog from '@/components/transactionInfoDialog';
    import { mapGetters, mapActions, mapMutations } from 'vuex';
    import {
        buildFundedPaymentTransaction,
        submitFundedTransaction,
    } from '@jimber/stellar-crypto';
    import Logger from 'js-logger';
    import { formatBalance } from '@/utils/filters/formatBalance';
    import validate from 'bitcoin-address-validation';
    import { withdrawBTC } from '@/services/BtcService';

    export default {
        name: 'transfer',
        components: {
            FormComponent,
            TransactionInfoDialog,
            // QrScannerDialog,
            QrDialog,
        },
        data() {
            return {
                tabs: ['receive', 'send'],
                transactionInfoDialog: false,
                qrScannerDialog: false,
                qrDialog: false,
                formObject: {
                    to: { address: this.$route.params?.to },
                    amount: null,
                    message: '',
                    sender: null,
                },
                selectedTab: 1,
                selectedAccount: {},
                qrReadingError: false,
                selectedCurrency: 'TFT',
                fee: 0.01,
                accountsReady: false,
            };
        },
        mounted() {
            this.disableAccountEventStreams();
            const updatePromises = this.accounts.map(account =>
                this.updateAccount(account.id)
            );

            Promise.all(updatePromises).then(() => {
                this.accountsReady = true;
            });

            this.$router.replace({
                query: { tab: this.tabs[this.tabs.length - 1] },
            });
            if (this.$route.params.account) {
                this.selectedAccount = this.accounts.find(
                    x => x.id === this.$route.params.account
                );
                if (this.$route.params.asset_code) {
                    this.selectedCurrency = this.$route.params.asset_code;
                    return;
                }
            }
            if (!this.selectedAccount.address)
                this.selectedAccount = this.accounts[0];
        },
        computed: {
            ...mapGetters(['accounts', 'currencies']),
            active() {
                return this.$route.query.tab;
            },
            isValidBtcAddress() {
                if (this.selectedCurrency !== 'BTC') {
                    return false;
                }
                if (
                    !this.formObject ||
                    !this.formObject.to ||
                    !this.formObject.to.address
                ) {
                    return false;
                }
                try {
                    return validate(this.formObject.to.address, 'mainnet');
                } catch (e) {
                    return false;
                }
            },
            availableAccounts() {
                switch (this.active) {
                    case 'receive':
                        return this.accounts;
                    case 'send': // Filter accounts based on the selected currency
                        const accounts = this.accounts.filter(account => {
                            // Check if account has balance for the selected currency
                            return account.balances.find(
                                balance =>
                                    balance.asset_code ===
                                        this.selectedCurrency &&
                                    (this.selectedCurrency === 'BTC' ||
                                        Number(balance.balance) > 0.1)
                            );
                        });
                        return accounts.sort(
                            (account, otherAccount) =>
                                account.position - otherAccount.position
                        );
                    default:
                        return [];
                }
            },
        },
        methods: {
            ...mapActions(['updateAccount', 'disableAccountEventStreams']),
            ...mapMutations(['startAppLoading', 'stopAppLoading']),
            scanQR() {
                window.vueInstance = this; //Don't remove this for flutter app
                const self = this;
                window.flutter_inappwebview
                    .callHandler('SCAN_QR')
                    .then(function (result) {
                        self.onDecode(result);
                    });
            },
            onDecode(code) {
                var url = new URL(code);
                var tftAddress = url.hostname;
                var currency = url.protocol.match(/[a-zA-Z]+/g)[0];

                if (tftAddress === '') {
                    tftAddress = url.pathname.replace('//', '');
                }
                const currencyIndex = this.currencies.findIndex(c => {
                    return c.toLowerCase() === currency;
                });
                this.selectedCurrency = this.currencies[currencyIndex];
                this.formObject.to.address = tftAddress;
                this.formObject.amount =
                    url.searchParams.get('amount') === 'null'
                        ? ''
                        : url.searchParams.get('amount');
                this.formObject.message =
                    url.searchParams.get('message') === 'null'
                        ? ''
                        : url.searchParams.get('message');
                this.formObject.sender =
                    url.searchParams.get('sender') === 'null'
                        ? ''
                        : url.searchParams.get('sender');
            },
            getQueryVar(url, varName) {
                var val;
                url = new URL(url);
                if (varName === 'HOST') {
                    val = url.pathname.replace('//', '');
                } else {
                    val = url.searchParams.get(varName);
                }
                return val;
            },
            transferConfirmed() {
                if (!this.checkForm()) {
                    console.log('form not valid');
                    return;
                }

                const ASSET_CODE = this.$refs.formComponent.selectedCurrency;
                const form = this.$refs.formComponent;
                const fromAccount = form.selectedAccount;
                const balance = Number(
                    fromAccount.balances.find(b => b.asset_code === ASSET_CODE)
                        .balance
                );
                const amountToTransfer = Number(form.formObject.amount);

                //@todo: fix this
                let fee = validate(this.formObject.to.address, 'mainnet')
                    ? 0
                    : this.fee;
                if (this.selectedTab && balance < amountToTransfer + fee) {
                    this.$flashMessage.error('not enough funds');
                    return;
                }

                if (this.active === 'receive') {
                    this.qrDialog = true;
                } else if (this.active === 'send') {
                    this.transactionInfoDialog = true;
                }
                // this.$refs.formComponent.$refs.form.inputs.forEach( input => input.blur() )
            },
            async send() {
                if (validate(this.formObject.to.address, 'mainnet')) {
                    await withdrawBTC(
                        this.selectedAccount.keyPair,
                        this.formObject.to.address,
                        new Number(this.formObject.amount)
                    );

                    this.$router.push({
                        name: 'details',
                        params: { account: this.selectedAccount.id },
                    });
                    return;
                }

                try {
                    const fundedTransaction = await buildFundedPaymentTransaction(
                        this.selectedAccount.keyPair,
                        this.formObject.to.address,
                        new Number(this.formObject.amount),
                        this.formObject.message,
                        this.selectedCurrency
                    );

                    await submitFundedTransaction(
                        fundedTransaction,
                        this.selectedAccount.keyPair
                    );

                    this.$flashMessage.info(
                        `Successfully transferred ${
                            this.formObject.amount | formatBalance
                        } ${this.selectedCurrency} to ${
                            this.formObject.to.address
                        }.`
                    );
                } catch (e) {
                    //@todo show correct error message for multiple errors eg: "reason": "invalid address"
                    Logger.error('error Payment failed', { e });
                    this.$flashMessage.error(`Payment failed: ${e.message}`);
                }

                this.$router.push({
                    name: 'details',
                    params: { account: this.selectedAccount.id },
                });
            },
            selectAccount(account) {
                this.selectedAccount = account;
            },
            checkForm() {
                return this.$refs.formComponent.$refs.form.validate();
            },
            async closeTransactionInfoDialog(save) {
                this.startAppLoading();
                if (save) await this.send();
                this.transactionInfoDialog = false;
                this.stopAppLoading();
            },
            closeQrScannerDialog() {
                this.qrScannerDialog = false;
            },
            closeQrDialog() {
                this.qrDialog = false;
            },
            balanceForCurrency(balances) {
                return balances.find(
                    x => x.asset_code === this.selectedCurrency
                ).balance;
            },
        },
        watch: {},
    };
</script>
<style scoped lang="scss">
    .transfer {
        .v-btn-toggle {
            background-color: transparent;
        }

        .v-btn--active {
            background-color: var(--accent-color) !important;
            color: white !important;
            border: none;
        }

        input {
            // display: none;
            background-color: green;
        }
    }

    .v-select__selections > input[type='text'] {
        display: none;
    }
</style>

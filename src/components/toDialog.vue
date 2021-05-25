<template>
    <section class="to-dialog">
        <v-dialog v-model="dialog" fullscreen scrollable persistent>
            <v-card class="no-radius">
                <v-card-title style="background-color: #34495e; color: white" dense>
                    Search contact
                    <v-spacer></v-spacer>
                    <v-btn text icon @click="closeDialog(false)">
                        <v-icon :color="$route.meta.accent"> fas fa-times </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="px-1">
                    <v-col>
                        <v-row justify="center" class="mb-3">
                            <v-btn-toggle v-model="selected" dense mandatory class="round elevation-0">
                                <v-btn text class="px-3 my-1 mx-1 round" v-for="(tab, index) in tabs" :key="tab.name"
                                    >{{ tab.name }}
                                </v-btn>
                            </v-btn-toggle>
                        </v-row>

                        <v-row justify="center" class="mx-2" v-show="selected === 0">
                            <accountCard
                                style="width: 100%"
                                v-for="(account, index) in computedAccounts"
                                :key="account.id"
                                class="my-2"
                                @click.native="useAccount(account)"
                                :account="account"
                            />
                        </v-row>

                        <div v-show="selected === 1">
                            <v-form ref="externForm" v-model="valid">
                                <v-text-field
                                    v-if="selected === 1"
                                    clearable
                                    prepend-icon="fas fa-user"
                                    :label="
                                        selectedCurrency === 'BTC'
                                            ? 'To (BTC or Wallet Address)'
                                            : 'To (Wallet Address)'
                                    "
                                    v-model="externAddress"
                                    :rules="toRules"
                                    autofocus
                                />
                                <v-text-field
                                    v-else
                                    clearable
                                    prepend-icon="fas fa-user"
                                    :label="
                                        selectedCurrency === 'BTC'
                                            ? 'To (BTC or Wallet Address)'
                                            : 'To (Wallet Address)'
                                    "
                                    v-model="externAddress"
                                    :rules="toRules"
                                />
                            </v-form>

                            <v-row justify="center" class="mt-2">
                                <v-btn
                                    style="width: 90%"
                                    :color="$route.meta.accent"
                                    @click="
                                        selectAccount({
                                            address: externAddress,
                                        })
                                    "
                                    :disabled="!valid"
                                >
                                    Use address
                                </v-btn>
                            </v-row>
                        </div>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>
<script>
    import AccountCard from './AccountCard';
    export default {
        name: 'to-dialog',
        components: {
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
            accounts: {
                type: Array,
            },
            toRules: {
                type: Array,
            },
            selectedAccount: {
                type: Object,
            },
            selectedCurrency: {
                type: String,
            },
        },
        data() {
            return {
                selected: 0,
                externAddress: '',
                tabs: [
                    { name: 'Own wallets', value: 0 },
                    { name: 'Others', value: 1 },
                ],
                valid: false,
            };
        },
        computed: {
            computedAccounts() {
                return this.accounts.filter(x => x.name != this.selectedAccount.name);
            },
            isBtcAddress() {
                return this.accounts.filter(x => x.name != this.selectedAccount.name);
            },
        },
        mounted() {},
        methods: {
            selectAccount() {
                this.closeDialog(true, {
                    address: this.externAddress,
                });
                this.$refs.externForm.reset();
                setTimeout(() => {
                    this.selected = 0;
                }, 1000);
            },
            useAccount(account) {
                this.closeDialog(true, {
                    address: account.id,
                });
            },
        },
        watch: {
            selected() {
                this.$refs.externForm.resetValidation();
            },
        },
    };
</script>
<style scoped lang="scss">
    .to-dialog {
    }
    .v-btn--active {
        background-color: var(--accent-color) !important;
        color: white !important;
        border: none !important;
    }

    .wallet-card {
        cursor: pointer;
    }
    .remove-margin {
        margin: 0px !important;
    }
</style>

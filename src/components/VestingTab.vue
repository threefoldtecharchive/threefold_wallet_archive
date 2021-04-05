<template>
    <div class="VestingTab pa-0 fill-height">
        <v-dialog v-model="acceptDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Vesting Policy
                </v-card-title>

                <v-card-text class="pt-6">
                    I understand that by going through this process I
                    voluntarily put my <b>ThreeFold Tokens</b> (<b>TFT</b>) into
                    a vesting scheme that will result in my <b>TFT</b> being
                    locked-up and inaccessible, and that these vested
                    <b>TFT</b> will only unlock when 1 or more criteria of the
                    vesting scheme have been met. More information can be found
                    <b
                        ><a
                            href="https://wiki.threefold.io/#/threefold__vesting_pool"
                            target="_blank"
                            >here</a
                        ></b
                    >
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="accent"
                        elevation="0"
                        @click="acceptDialog = false"
                    >
                        Agree
                    </v-btn>
                    <v-btn color="error" text @click="$emit('declined')">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div v-if="loading || acceptDialog" class="fill-height">
            <div class="container">
                <v-progress-circular color="accent" size="100" indeterminate>
                    <h3>Loading</h3>
                </v-progress-circular>
            </div>
        </div>
        <div v-else-if="!vestingAccount" class="pa-4 fill-height">
            <v-card class="pa-2" style="width: 100%">
                <v-card-title>
                    Activate Vesting for
                    <b class="ml-1">{{ account.name }}</b></v-card-title
                >
                <v-card-text
                    >Activate vesting to be able to join the vesting program.
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        color="accent"
                        elevation="0"
                        @click="onActivateVesting"
                        >activate Vesting
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <div v-else class="pa-4 fill-height">
            <v-card class="pr-0 min border">
                <div ref="card" class="content">
                    <v-btn dark small icon text class="copybutton">
                        <v-icon size="15"> fas fa-copy</v-icon>
                    </v-btn>
                    <v-card-text class="py-1">
                        <v-col>
                            <v-row>
                                <span class="title text-capitalize">
                                    Vesting Wallet
                                </span>

                                <span
                                    class="font-weight-light fa-xs blue-grey--text ml-1"
                                >
                                    vesting
                                </span>
                            </v-row>
                            <v-row>
                                <span
                                    class="font-weight-light blue-grey--text ml-1"
                                    style="width: 80%"
                                >
                                    {{ vestingAccount.id }}
                                </span>
                            </v-row>
                            <v-row>
                                <v-col class="py-1" align="center">
                                    <div
                                        class="subtitle-2 blue-grey--text font-weight-light"
                                    >
                                        Amount of vested TFT
                                    </div>
                                    <div class="body-2">
                                        {{
                                            vestingAccount.balances.find(
                                                b => b.asset_code === 'TFT'
                                            ).balance
                                                | formatBalanceHumanReadable
                                        }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="pt-8">
                            <v-row>
                                <div>
                                    Transfer <b>TFT</b> to the
                                    <b>Vesting Wallet</b> in order to vest them.
                                </div>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </div>
                <v-card-actions class="pa-4">
                    <v-btn elevation="0" color="accent" @click="onVestTokens"
                        >vest TFT
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>
<script>
    import {
        checkVesting,
        generateVestingAccount,
    } from '@jimber/stellar-crypto';
    import { mapAccount } from '@/services/AccountService';

    export default {
        name: 'VestingTab',
        props: {
            account: { type: Object, required: true },
        },
        mounted() {
            checkVesting(this.$props.account.id).then(vestingAccount => {
                if (vestingAccount) {
                    this.vestingAccount = vestingAccount;
                }

                this.loading = false;
            });
        },
        methods: {
            async onActivateVesting() {
                this.loading = true;
                const vestingAccount = await generateVestingAccount(
                    this.$props.account.id
                );
                if (vestingAccount) {
                    this.vestingAccount = vestingAccount;
                }

                this.loading = false;
            },
            async onVestTokens() {
                await this.$router.push({
                    name: 'transfer',
                    params: {
                        account: this.account.id,
                        to: this.vestingAccount.id,
                        asset_code: 'TFT',
                    },
                });
            },
        },
        data() {
            return {
                loading: true,
                vestingAccount: null,
                acceptDialog: true,
            };
        },
    };
</script>
<style scoped lang="scss">
    .container {
        display: flex;
        justify-items: center;
        justify-content: center;
        padding: 10vw;
    }
</style>

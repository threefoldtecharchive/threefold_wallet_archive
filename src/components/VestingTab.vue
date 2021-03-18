<template>
    <div v-if="loading" class="pa-0 fill-height">loading</div>
    <div v-else-if="!vestingAccount" class="pa-0 fill-height">
        no vesting <br />
        <v-btn color="accent" @click="onActivateVesting"
            >activate Vesting
        </v-btn>
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
                                        ).balance | formatBalanceHumanReadable
                                    }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-card-text>
            </div>
            <v-card-actions>
                <v-btn elevation="0" color="accent" @click="onVestTokens"
                    >vest TFT
                </v-btn>
            </v-card-actions>
        </v-card>
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
            };
        },
    };
</script>
<style scoped lang="scss"></style>

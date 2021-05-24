<template>
    <div class="VestingTab pa-0 fill-height">
        <VestingWarningDialog
            @accepted="accepted = true"
            @declined="$emit('declined')"
        />
        <div v-if="loading || !accepted" class="fill-height">
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
                    >Activate Vesting to be able to join the vesting program.
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        color="accent"
                        elevation="0"
                        @click="onActivateVesting"
                        >Activate Vesting
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
                                    Vesting
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
                                    <b>Vesting Wallet</b> to start vesting.
                                </div>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </div>
                <v-card-actions class="pa-4">
                    <v-btn elevation="0" color="accent" @click="onVestTokens"
                        >Vest TFT
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
    import VestingWarningDialog from '@/components/VestingWarningDialog';

    export default {
        name: 'VestingTab',
        components: { VestingWarningDialog },
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
                accepted: false,
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

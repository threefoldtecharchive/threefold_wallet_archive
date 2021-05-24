<template>
    <div class="Activate pa-2" style="width: 100%">
        <v-card class="pa-2" style="width: 100%">
            <v-card-title> Activate {{ asset }} Asset</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-checkbox
                        v-model="terms"
                        :rules="[v => !!v || 'You must agree to continue!']"
                        required
                    >
                        <template v-slot:label>
                            <div>
                                By clicking 'Activate', I acknowledge
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <a
                                            target="_blank"
                                            href="http://example.com"
                                            @click.stop
                                            v-on="on"
                                        >
                                            ThreeFold's {{ asset }}  Asset Guide
                                        </a>
                                    </template>
                                and agree to the 
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <a
                                            target="_blank"
                                            href="http://example.com"
                                            @click.stop
                                            v-on="on"
                                        >
                                            Terms and Conditions
                                        </a>
                                    </template>
                                    Opens in new window
                                </v-tooltip>
                            </div>
                        </template>
                    </v-checkbox>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    elevation="0"
                    color="accent"
                    :disabled="!valid"
                    style="text-align: right"
                    @click="onActivateClick"
                >
                    activate
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';
    import { Asset, Operation, TransactionBuilder } from 'stellar-base';
    import { mapMutations } from 'vuex';
    import { getConfig } from '@jimber/stellar-crypto';

    export default {
        name: 'Deposit',
        data() {
            return {
                asset: null,
                account: null,
                terms: false,
                valid: true,
            };
        },
        beforeMount() {
            this.account = store.getters.accounts.find(
                x => x.id === this.$route.params.account
            );

            this.asset = this.$route.params.asset;

            if (!this.account || !this.asset) {
                router.push({ name: 'error screen' });
                return;
            }
        },
        mounted() {},
        methods: {
            ...mapMutations([
                'startAppLoading',
                'stopAppLoading',
                'setLoadingMessage',
            ]),
            onActivateClick() {
                if (!this.$refs.form.validate()) {
                    return;
                }
                this.activateAsset();
            },
            async activateAsset() {
                this.startAppLoading();
                try {
                    this.setLoadingMessage({
                        message: `Activating ${this.asset} Asset`,
                    });

                    await this.selfActivateAsset();
                    await this.$router.push({
                        name: 'details',
                        params: {
                            account: this.account.id,
                        },
                    });
                    this.stopAppLoading();
                } catch (e) {
                    await this.activateWithFunding();
                }
            },
            async selfActivateAsset() {
                const { server, currencies, network } = getConfig();
                console.log({ server, currencies, network });
                const fee = String(await server.fetchBaseFee());

                const transactionAccount = await server.loadAccount(
                    this.account.keyPair.publicKey()
                );

                const transaction = new TransactionBuilder(transactionAccount, {
                    fee,
                    networkPassphrase: network,
                });

                const asset = new Asset(
                    currencies[this.asset].asset_code,
                    currencies[this.asset].issuer
                );
                transaction.addOperation(
                    Operation.changeTrust({
                        asset: asset,
                    })
                );

                transaction.setTimeout(3000);
                const tx = transaction.build();
                tx.sign(this.account.keyPair);

                await server.submitTransaction(tx);

                this.$flashMessage.info(
                    `Successfully activated ${this.asset} Asset, it could take a few moments before you see it.`
                );
            },
            async activateWithFunding() {
                this.setLoadingMessage({
                    message: `activating ${this.asset} Asset`,
                    additional: `trying to activate ${this.asset} with activation service`,
                });
                try {
                    throw new Error('not implemented');
                } catch (e) {
                    await this.$router.push({
                        name: 'error screen',
                        params: {
                            reason: 'asset activation mistake',
                            fix: 'Contact Support',
                        },
                    });
                    this.stopAppLoading();
                    return;
                }
                await this.$router.push({
                    name: 'details',
                    params: {
                        account: this.account.id,
                    },
                });
                this.stopAppLoading();
            },
        },
    };
</script>

<style scoped></style>

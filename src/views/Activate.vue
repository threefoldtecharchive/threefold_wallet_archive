<template>
    <div class="Activate pa-4">
        <div class="status">
            {{ asset }} status on your account :
            <b
                class="green--text"
                v-if="account.balances.find(b => b.asset_code === asset)"
            >
                ok
            </b>
            <b class="red--text" v-else>
                not activated
            </b>
        </div>
        <h3>Do you want to activate {{ asset }} on this wallet?</h3>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-checkbox
                v-model="terms"
                :rules="[v => !!v || 'You must agree to continue!']"
                required
            >
                <template v-slot:label>
                    <div>
                        I agree to the
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <a
                                    target="_blank"
                                    href="http://example.com"
                                    @click.stop
                                    v-on="on"
                                >
                                    Terms and conditions.
                                </a>
                            </template>
                            Opens in new window
                        </v-tooltip>
                    </div>
                </template>
            </v-checkbox>
            <v-btn color="accent" :disabled="!valid" @click="onActivateClick">
                activate
            </v-btn>
        </v-form>
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
                        message: `activating ${this.asset}`,
                        additional: `trying to self-activate ${this.asset}`,
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

                console.log(this.account.keyPair);

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

                console.log(tx);

                await server.submitTransaction(tx);

                this.$flashMessage.info(
                    `Successfully activated ${this.asset}, it could take a few moments before you see it.`
                );
            },
            async activateWithFunding() {
                this.setLoadingMessage({
                    message: `activating ${this.asset}`,
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

<template>
    <div class="Activate pa-2" style="width: 100%">
        <v-card class="pa-2" style="width: 100%">
            <v-card-title> Activate {{ asset }} Now</v-card-title>
            <v-card-text>
                <div class="status">
                    {{ asset }} status on your account :
                    <b class="green--text" v-if="account.balances.find(b => b.asset_code === asset)"> ok </b>
                    <b class="red--text" v-else> not activated </b>
                </div>
                <h3>Do you want to activate {{ asset }} on this wallet?</h3>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-checkbox v-model="terms" :rules="[v => !!v || 'You must agree to continue!']" required>
                        <template v-slot:label>
                            <div>
                                I agree to the
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <a @click.prevent.stop="showTerms = true"> Terms and conditions. </a>
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
        <v-dialog v-model="showTerms" fullscreen>
            <v-card>
                <v-card-title>
                    <v-row>
                        Terms & conditions
                        <v-spacer></v-spacer>
                        <v-btn icon @click="showTerms = false">
                            <v-icon>fas fa-times</v-icon>
                        </v-btn>
                    </v-row>
                </v-card-title>
                <iframe
                    style="height: calc(100vh - 62px); width: 100%"
                    src="https://wiki.threefold.io/#/legal__legal"
                    frameborder="0"
                ></iframe>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import store from '@/store';
    import router from '@/router';
    import { mapMutations } from 'vuex';
    import { selfFundTrustLine, fundTrustLine } from '@jimber/stellar-crypto';

    export default {
        name: 'Deposit',
        data() {
            return {
                asset: null,
                account: null,
                terms: false,
                valid: true,
                showTerms: false,
            };
        },
        beforeMount() {
            this.account = store.getters.accounts.find(x => x.id === this.$route.params.account);

            this.asset = this.$route.params.asset;

            if (!this.account || !this.asset) {
                router.push({ name: 'error screen' });
                return;
            }

            if (this.account.balances.find(b => b.asset_code === this.asset)) {
                this.$router.replace({
                    name: 'details',
                    params: {
                        account: this.account.id,
                    },
                });
                return;
            }
        },
        mounted() {},
        methods: {
            ...mapMutations(['startAppLoading', 'stopAppLoading', 'setLoadingMessage']),
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
                        message: `Activating ${this.asset}`,
                        additional: `Trying to self-activate ${this.asset}`,
                    });

                    await selfFundTrustLine(this.account.keyPair, 'BTC');
                    this.$flashMessage.info(
                        `Successfully activated ${this.asset}, it could take a few moments before you see it.`
                    );
                    await this.$router.replace({
                        name: 'details',
                        params: {
                            account: this.account.id,
                        },
                    });
                    this.stopAppLoading();
                } catch (e) {
                    console.log('transaction with activation service');

                    this.setLoadingMessage({
                        message: `activating ${this.asset}`,
                        additional: `trying to activate ${this.asset} with activation service`,
                    });
                    await fundTrustLine(this.account.keyPair, 'BTC');
                    this.$flashMessage.info(
                        `Successfully activated ${this.asset}, it could take a few moments before you see it.`
                    );

                    await this.$router.replace({
                        name: 'details',
                        params: {
                            account: this.account.id,
                        },
                    });
                    this.stopAppLoading();
                }
            },
        },
    };
</script>

<style scoped></style>

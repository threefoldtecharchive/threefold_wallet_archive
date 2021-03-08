<template>
    <section class="create-wallet fill-height">
        <v-col>
            <div class="layout justify-center">
                <v-btn-toggle dense mandatory class="round">
                    <v-btn
                        text
                        v-for="tab in tabs"
                        :key="tab"
                        class="px-3 my-1 mx-1 round"
                        @click="currentTab = tab"
                        >{{ tab }}</v-btn
                    >
                </v-btn-toggle>
            </div>
            <v-container v-if="currentTab === 'create'">
                <v-text-field
                    :error-messages="walletNameErrors"
                    @input="walletNameErrors = []"
                    v-model.trim="walletName"
                    class="red--text"
                    label="Wallet name"
                ></v-text-field>

                <div>
                    <v-btn
                        class="mx-0 mt-3"
                        style="width: 100%;"
                        color="accent"
                        @click="createNewWallet"
                        :disabled="!walletName"
                    >
                        Create wallet</v-btn
                    >
                </div>
            </v-container>

            <v-container v-if="currentTab === 'import'">
                <div class="caption layout justify-center">
                    <span
                        >You can use this to load a stellar secret or to import
                        a wallet from the Threefold app.</span
                    >
                </div>

                <div>
                    <v-text-field
                        :error-messages="walletNameErrors"
                        @input="walletNameErrors = []"
                        v-model.trim="walletName"
                        class="red--text"
                        label="Wallet name"
                    ></v-text-field>
                </div>
                <div>
                    <v-textarea
                        :error-messages="secretErrors"
                        @input="secretErrors = []"
                        v-model="secret"
                        name="input-7-1"
                        label="Words (Seed phrase) or Stellar secret"
                        value=""
                        hint="Please enter a stellar secret without any spaces or a seed phrase with all words lowercased and separted by one space."
                    >
                    </v-textarea>
                </div>
                <div>
                    <v-expansion-panels v-model="panel" flat>
                        <v-expansion-panel flat>
                            <v-expansion-panel-header>
                                <h3>Advanced</h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-text-field
                                    v-model.number="index"
                                    label="Address index (default 0)"
                                    :disabled="secretIsStellarSecret"
                                >
                                </v-text-field>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <div class="my-4 warning layout">
                    <v-col cols="1">
                        <v-icon small>fas fa-exclamation-triangle</v-icon>
                    </v-col>
                    <v-col class="body-2" style="line-height: 2rem;">
                        Make sure to keep this seed written down and stored in a
                        safe place.
                    </v-col>
                </div>

                <v-row>
                    <v-btn
                        color="accent"
                        class="mt-3"
                        style="width: 100%;"
                        @click="importWallet"
                        :disabled="!walletName"
                    >
                        Import wallet</v-btn
                    >
                </v-row>
            </v-container>
        </v-col>
    </section>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import {
        isValidWalletName,
        validateAndGenerateSeed,
        importedSecretFound,
    } from '@/services/AccountManagementService';
    import {
        seedPhraseFromStellarSecret,
        getSeedFromSeedPhrase,
    } from '@jimber/stellar-crypto';
    import router from '@/router';
    import config from '../../public/config';
    import Logger from 'js-logger';
    import { getEntropyFromPhrase } from 'mnemonicconversion2924';
    import cryptoService from '@/services/cryptoService';

    export default {
        name: 'create-wallet',
        components: {},
        props: {
            show: {
                type: Boolean,
            },
        },
        data() {
            return {
                tabs: ['import'], // create is disabled
                currentTab: 'import',
                walletName: null,
                secret: null,
                index: 0,
                walletNameErrors: [],
                secretErrors: [],
                panel: null,
            };
        },
        computed: {
            ...mapGetters(['accounts']),
            secretIsStellarSecret() {
                return this.secret?.length === '56';
            },
        },
        mounted() {},
        methods: {
            ...mapActions([
                'generateAppAccount',
                'generateImportedAccount',
                'initializeAccountWatcher',
                'initializeTransactionWatcher',
            ]),
            clearForm() {
                this.$router.push({ name: 'home' });
                this.clearErrors();
                this.walletName = null;
                this.secret = null;
            },
            clearErrors() {
                this.walletNameErrors = [];
                this.secretErrors = [];
            },
            createNewWallet() {
                this.clearErrors();

                // Todo add removing of spaces in between words
                this.walletName = this.walletName.trim();

                const walletValidation = isValidWalletName(
                    this.walletName,
                    this.accounts
                );
                if (!walletValidation.success) {
                    this.walletNameErrors.push(walletValidation.message);
                    return;
                }
                this.generateAppAccount(this.walletName).catch(e => {
                    this.$flashMessage.error('Failed to generate account');
                });
                this.clearForm();
            },
            importWallet() {
                this.clearErrors();

                // Todo add removing of spaces in between words
                this.walletName = this.walletName.trim();

                const walletValidation = isValidWalletName(
                    this.walletName,
                    this.accounts
                );

                if (!walletValidation.success) {
                    this.walletNameErrors.push(walletValidation.message);
                    return;
                }

                if (this.secret.length === 56) {
                    this.importStellarSeed();
                    return;
                }
                if (this.secret.split(' ').length === 29) {
                    const entropy = getEntropyFromPhrase(
                        this.secret.split(' ')
                    );
                    const mnemonic = cryptoService.generateMnemonicFromSeed(
                        entropy
                    );
                    this.secret = mnemonic;
                }
                if (this.secret.split(' ').length === 24) {
                    this.importNewWallet();
                    return;
                }
                this.secretErrors.push(
                    'Please enter a valid stellar key or 24 word seed phrase.'
                );
            },
            async importNewWallet() {
                const seedValidation = validateAndGenerateSeed(
                    this.secret,
                    this.accounts
                );

                if (!seedValidation.success) {
                    this.secretErrors.push(seedValidation.message);
                    return;
                }

                const seedPhrase = seedValidation.seedPhrase;
                const walletName = this.walletName;

                this.generateImportedAccount({
                    seedPhrase,
                    walletName,
                    index: this.index,
                })
                    .then(account => {
                        this.$flashMessage.info(
                            `Successfully imported ${account.name}.`
                        );
                        if (config.watchersEnabled) {
                            this.initializeAccountWatcher(account);
                            this.initializeTransactionWatcher(account);
                        }
                    })
                    .catch(e => {
                        router.push({
                            name: 'error screen',
                            params: {
                                reason: 'Failed to import new account.',
                                fix:
                                    "Try again later, if that doesn't work contact support",
                            },
                        });
                    });

                this.clearForm();
            },
            importStellarSeed() {
                const foundWallet = importedSecretFound(
                    this.secret,
                    this.accounts
                );

                if (foundWallet) {
                    this.secretErrors.push(
                        `This stellar secret is used by ${foundWallet.name}`
                    );
                    return;
                }
                let seedPhrase;
                try {
                    seedPhrase = seedPhraseFromStellarSecret(this.secret);
                } catch (e) {
                    this.secretErrors.push(`Please enter a valid stellar key.`);
                    return;
                }
                const walletName = this.walletName;
                const index = -1;
                // @Todo rivine address calculation for an -1 index is wrong
                // For now we don't try conversion on those acccounts
                const isConverted = true;
                Logger.info('Importing stellar secret but not converting');
                this.generateImportedAccount({
                    seedPhrase,
                    walletName,
                    createWallet,
                    isConverted,
                })
                    .then(account => {
                        this.$flashMessage.info(
                            `Successfully imported ${account.name}.`
                        );
                        if (config.watchersEnabled) {
                            this.initializeAccountWatcher(account);
                            this.initializeTransactionWatcher(account);
                        }
                    })
                    .catch(e => {
                        Logger.error('error generating imported wallet', { e });
                        router.push({
                            name: 'error screen',
                            params: {
                                reason: 'Failed to import account.',
                                fix:
                                    "Try again later, if that doesn't work contact support",
                            },
                        });
                    });

                this.clearForm();
            },
        },
    };
</script>
<style scoped lang="scss">
    .create-wallet {
        .v-btn-toggle {
            background-color: transparent !important;
        }
        .v-btn--active {
            background-color: var(--accent-color) !important;
            color: white !important;
            border: none !important;
        }
        .v-expansion-panel {
            background-color: transparent !important;
        }
    }
</style>

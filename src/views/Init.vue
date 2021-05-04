<template>
    <section class="init">
        <v-container fill-height>
            <v-layout fill-height>
                <v-col>
                    <v-row>
                        <h1>Loading wallet ...</h1>
                    </v-row>
                    <v-row v-if="showInputWalletSeed">
                        <v-text-field v-model="devWalletSeed" type="password" label="devWalletSeed"></v-text-field>
                        <v-btn @click="devInitWallet"> Start wallet</v-btn>
                    </v-row>
                </v-col>
            </v-layout>
        </v-container>
    </section>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex';
    import { decodeBase64 } from 'tweetnacl-util';
    import router from '@/router';
    import { migrateToPkid } from '@/services/PkidMigrationService';
    import config from '../../public/config';
    import Logger from 'js-logger';

    export default {
        name: 'Init',
        components: {},
        props: [],
        data() {
            return {
                initialized: false,
                devWalletSeed: null,
            };
        },
        computed: {
            showInputWalletSeed() {
                return !!config.showInputWalletSeed;
            },
        },
        mounted() {
            window.vueInstance = this;
            if (config.devWallet) {
                let paymentRequest = config.enablePaymentRequest
                    ? {
                          encodedAddress: btoa('GADPT2P3PXFTNRUSMOW2IGIWOTHGPQ2XF66G4Y4DENCNRZJVW4V7BUSJ'),
                          encodedAmount: btoa('5'),
                          encodedMessage: btoa('test.3bot'),
                      }
                    : null;
                window.vueInstance.startWallet('devWallet.3bot', config.devWallet, null, null, paymentRequest);
            }
        },
        methods: {
            ...mapActions(['initialize']),
            ...mapMutations(['setDebugSeed', 'setPaymentRequest']),
            async startWallet(doubleName, seed, importedWallets, appWallets, encodedPaymentRequest = false) {
                if (this.initialized) {
                    return;
                }

                if (encodedPaymentRequest) {
                    const paymentRequest = {
                        address: atob(encodedPaymentRequest.encodedAddress),
                        amount: atob(encodedPaymentRequest.encodedAmount),
                        message: atob(encodedPaymentRequest.encodedMessage),
                    };
                    this.setPaymentRequest(paymentRequest);
                }

                this.initialized = true;

                this.setDebugSeed(seed);
                seed = new Uint8Array(decodeBase64(seed));
                importedWallets = JSON.parse(importedWallets);
                appWallets = JSON.parse(appWallets);
                Logger.info('startedWallet');
                try {
                    await migrateToPkid({ seed, importedWallets, appWallets });
                } catch (error) {
                    Logger.error('fatal error migrateToPkid');

                    // add fatal error
                    return;
                }
                try {
                    Logger.info('initialize');

                    await this.initialize({
                        doubleName,
                        seed,
                        importedWallets,
                        appWallets,
                    });
                } catch (error) {
                    console.error(error);
                    Logger.error('init error', { error });
                    router.push({
                        name: 'error screen',
                        params: {
                            reason: 'Initialization failed',
                            fix: 'Please refresh, if error persists, please contact support?',
                        },
                    });
                }
            },
            devInitWallet() {
                this.initialized = false;
                this.startWallet('TESTNAME', this.devWalletSeed, 'null', 'null');
            },
        },
    };
</script>
<style scoped lang="scss"></style>

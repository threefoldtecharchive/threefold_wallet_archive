<template>
    <div class="fill-height dev-view">
        <v-tabs background-color="indigo" dark grow>
            <v-tab> Logs</v-tab>
            <v-tab-item class="pa-4">
                <v-card class="my-2 pa-2">
                    <p class="display-1 text--primary">application logs</p>
                    <v-btn color="primary" elevation="0" @click="copyLogs"> copy logs</v-btn>
                    <copy-field :value="value" label="logs" />
                    <pre
                        ref="logcard"
                        class="pa-2"
                        style="width: 100%; white-space: pre-wrap; background-color: #f3f3f3"
                        >{{ value }}</pre
                    >
                </v-card>
            </v-tab-item>
            <v-tab> Data</v-tab>
            <v-tab-item class="pa-4">
                <v-card class="pa-2 my-2">
                    <p class="display-1 text--primary">Main Data</p>
                    <v-card-text>
                        <ul>
                            <li>
                                <copy-field :value="appSeedPhrase" label="appSeedPhrase"></copy-field>
                            </li>
                            <li>
                                <copy-field :value="debugSeed" label="appSeedPhrase"></copy-field>
                            </li>

                            <li>
                                <copy-field :value="threeBotName" label="threeBotName"></copy-field>
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
                <v-card class="pa-2 my-2">
                    <rawDisplayer :value="accounts" title="accounts data" />
                </v-card>
                <v-card class="pa-2 my-2">
                    <rawDisplayer :value="pkidApp" title="pkid app accounts data" />
                </v-card>
                <v-card class="pa-2 my-2">
                    <rawDisplayer :value="pkidImported" title="pkid imported accounts data" />
                </v-card>
            </v-tab-item>
            <v-tab> Actions</v-tab>
            <v-tab-item class="pa-4">
                <v-card class="pa-2 my-2">
                    <v-card-title>Restart Wallet</v-card-title>
                    <v-card-text>
                        <p>Restart ThreeFold Connect Wallet</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="deep-purple" dark text @click="Restart"> Restart</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card class="pa-2 my-2">
                    <v-card-title> Retry Migration</v-card-title>
                    <v-card-text>
                        <p>Retry the conversion from TFChain to Stellar Network</p>
                        <v-col>
                            <v-row v-for="account in accounts" :key="account.id">
                                {{ account.name }}
                                <v-spacer></v-spacer>
                                <v-btn color="deep-purple" dark text x-small @click="retryMigrate(account)"
                                    >Retry
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </v-card>
                <addTrustlineCard class="pa-2 my-2" />
                <v-card class="pa-2 my-2">
                    <v-card-title>Reset App wallets</v-card-title>
                    <v-card-text>
                        <p>Resets App wallets</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="deep-purple" dark text @click="ResetAppWallets"> Reset</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card class="pa-2 my-2">
                    <v-card-title>goto PaymentSuccess</v-card-title>
                    <v-card-actions>
                        <v-btn color="deep-purple" dark text @click="$router.push('PaymentSuccess')"> Reset</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card class="pa-2 my-2">
                    <v-card-title> Remove Imported Wallets</v-card-title>
                    <v-card-actions>
                        <v-btn color="deep-purple" dark text @click="RemoveImportedAccounts"> Remove</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card class="pa-2 my-2">
                    <v-card-title> Show Error Page</v-card-title>
                    <v-card-text>
                        <p>Show the error screen</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="deep-purple" dark text @click="errorScreen"> Error</v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
    import { mapGetters, mapActions, mapMutations } from 'vuex';
    import { convertTokens, revineAddressFromSeed } from '@jimber/stellar-crypto';
    import AddTrustlineCard from '@/components/AddTrustlineCard.vue';
    import CopyField from '@/components/CopyField';

    export default {
        name: 'DevView',
        components: { CopyField, AddTrustlineCard },
        props: [],
        data() {
            return {};
        },
        computed: {
            ...mapGetters([
                'accounts',
                'pkidApp',
                'pkidImported',
                'appSeedPhrase',
                'threeBotName',
                'debugSeed',
                'currencies',
                'logs',
            ]),
            value() {
                String.prototype.repeat = function (num) {
                    if (num < 0) {
                        return '';
                    } else {
                        return new Array(num + 1).join(this);
                    }
                };

                function is_defined(x) {
                    return typeof x !== 'undefined';
                }

                function is_object(x) {
                    return Object.prototype.toString.call(x) === '[object Object]';
                }

                function is_array(x) {
                    return Object.prototype.toString.call(x) === '[object Array]';
                }

                let tab = 0;

                const rt = () => '    '.repeat(tab);

                const lg = function (x) {
                    let k;
                    // Limit
                    if (tab > 10) return '[...]';
                    let r = '';
                    if (!is_defined(x)) {
                        r = '[VAR: UNDEFINED]';
                    } else if (x === '') {
                        r = '[VAR: EMPTY STRING]';
                    } else if (is_array(x)) {
                        r = '[\n';
                        tab++;
                        for (k in x) {
                            r += rt() + k + ' : ' + lg(x[k]) + ',\n';
                        }
                        tab--;
                        r += rt() + ']';
                    } else if (is_object(x)) {
                        r = '{\n';
                        tab++;
                        for (k in x) {
                            r += rt() + k + ' : ' + lg(x[k]) + ',\n';
                        }
                        tab--;
                        r += rt() + '}';
                    } else {
                        r = x;
                    }
                    return r;
                };

                //don't worry about it
                delete Array.prototype.__class__;
                delete Array.prototype.__iter__;
                delete Array.prototype.__getslice__;
                delete Array.prototype.__setslice__;
                delete Array.prototype.__repr__;
                delete Array.prototype.__str__;
                delete Array.prototype.append;
                delete Array.prototype.__lt__;
                delete Array.prototype.extend;
                delete Array.prototype.insert;
                delete Array.prototype.remove;
                delete Array.prototype.index;
                delete Array.prototype.index;
                delete Array.prototype.py_sort;
                delete Array.prototype.py_clear;
                delete Array.prototype.py_pop;
                delete Array.prototype.__ge__;
                delete Array.prototype.__add__;
                delete Array.prototype.__mul__;
                delete Array.prototype.__rmul__;
                delete Array.prototype.add;
                delete Array.prototype.discard;
                delete Array.prototype.issuperset;
                delete Array.prototype.issubset;
                delete Array.prototype.__bindexOf__;
                delete Array.prototype.difference;
                delete Array.prototype.intersection;
                delete Array.prototype.union;
                delete Array.prototype.isdisjoint;
                delete Array.prototype.__eq__;
                delete Array.prototype.__gt__;
                delete Array.prototype.symmetric_difference;
                delete Array.prototype.__ne__;
                delete Array.prototype.py_update;
                delete Array.prototype.__le__;

                return lg([...this.logs]);
            },
        },
        mounted() {},
        methods: {
            ...mapMutations(['removeAppAccounts', 'removeImportedAccounts']),
            ...mapActions([
                'generateAppAccount',
                'persistPkidAppAccounts',
                'persistPkidImportedAccounts',
                'syncAccounts',
            ]),
            Restart() {
                location.reload();
            },
            createWallet() {
                this.generateAppAccount(`dev wallet #${Math.random().toString(36).substr(2, 5)}`);
            },
            copyLogs() {
                console.log(this.$refs.logcard.innerText);
                this.$root.$emit('copy', {
                    title: 'Copy logs to clipboard',
                    toCopy: this.$refs.logcard.innerText,
                    callback: () => {
                        this.$flashMessage.info(
                            `logs has been copied to clipboard (${this.$refs.logcard.innerText.substring(0, 8)}...).`
                        );
                    },
                });
            },
            async ResetAppWallets() {
                this.removeAppAccounts();
                await this.persistPkidAppAccounts([
                    {
                        walletName: 'Daily',
                        position: 0,
                        index: 0,
                    },
                ]);
                await this.syncAccounts();
            },
            async RemoveImportedAccounts() {
                await this.persistPkidImportedAccounts([]);
                await this.syncAccounts();
            },
            errorScreen() {
                this.$router.push({
                    name: 'error screen',
                    params: {
                        reason: 'conversion mistake',
                        fix: 'close and reopen wallet',
                    },
                });
            },
            async retryMigrate(account) {
                const revineAddress = revineAddressFromSeed(account.seedPhrase, account.index);
                await convertTokens(revineAddress, account.keyPair.publicKey());
            },
        },
    };
</script>
<style scoped lang="scss">
    .vcard {
        margin: 4px;
    }

    .dev-view {
        z-index: 500;
    }
</style>

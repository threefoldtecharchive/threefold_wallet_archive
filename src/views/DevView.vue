<template>
    <div class="fill-height dev-view">
        <v-tabs grow background-color="indigo" dark>
            <v-tab>
                Logs
            </v-tab>
            <v-tab-item>
                <v-card>
                    <p class="display-1 text--primary">
                        application logs
                    </p>
                    <v-btn @click="copyLogs">
                        copy logs
                    </v-btn>
                </v-card>

                <v-card flat tile>
                    <code ref="logcard" style="width: 98vw;">{{ value }}</code>
                </v-card>
            </v-tab-item>
            <v-tab>
                Data
            </v-tab>
            <v-tab-item>
                <v-card>
                    <p class="display-1 text--primary">
                        main data
                    </p>
                    <v-card-text>
                        <ul>
                            <li>
                                <copy-field
                                    label="appSeedPhrase"
                                    :value="appSeedPhrase"
                                ></copy-field>
                            </li>
                            <li>
                                <copy-field
                                    label="appSeedPhrase"
                                    :value="debugSeed"
                                ></copy-field>
                            </li>

                            <li>
                                <copy-field
                                    label="threeBotName"
                                    :value="threeBotName"
                                ></copy-field>
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
                <v-card>
                    <rawDisplayer title="accounts data" :value="accounts" />
                </v-card>
                <v-card flat tile>
                    <rawDisplayer
                        title="pkid app accounts data"
                        :value="pkidApp"
                    />
                </v-card>
                <v-card flat tile>
                    <rawDisplayer
                        title="pkid imported accounts data"
                        :value="pkidImported"
                    />
                </v-card>
            </v-tab-item>
            <v-tab>
                Actions
            </v-tab>
            <v-tab-item>
                <v-card>
                    <v-card-title>Restart wallet</v-card-title>
                    <v-card-text>
                        <p>Restarts the 3bot_connect wallet</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn dark text color="deep-purple" @click="Restart">
                            restart
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>
                        Retry migration
                    </v-card-title>
                    <v-card-text>
                        <p>
                            Retry the conversion from TFChain to Stellar network
                        </p>
                        <v-col>
                            <v-row
                                v-for="account in accounts"
                                :key="account.id"
                            >
                                {{ account.name }}
                                <v-spacer></v-spacer>
                                <v-btn
                                    x-small
                                    dark
                                    text
                                    color="deep-purple"
                                    @click="retryMigrate(account)"
                                    >Retry
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </v-card>
                <addTrustlineCard />
                <v-card>
                    <v-card-title>Reset app wallets</v-card-title>
                    <v-card-text>
                        <p>Resets app wallets</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            dark
                            text
                            color="deep-purple"
                            @click="ResetAppWallets"
                        >
                            Reset
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>
                        Remove imported wallets
                    </v-card-title>
                    <v-card-actions>
                        <v-btn
                            dark
                            text
                            color="deep-purple"
                            @click="RemoveImportedAccounts"
                        >
                            Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>
                        Show error page
                    </v-card-title>
                    <v-card-text>
                        <p>Show the error screen</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            dark
                            text
                            color="deep-purple"
                            @click="errorScreen"
                        >
                            Error
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
    import { mapGetters, mapActions, mapMutations } from 'vuex';
    import {
        convertTokens,
        revineAddressFromSeed,
    } from '@jimber/stellar-crypto';
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
                    return (
                        Object.prototype.toString.call(x) === '[object Object]'
                    );
                }

                function is_array(x) {
                    return (
                        Object.prototype.toString.call(x) === '[object Array]'
                    );
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
                this.generateAppAccount(
                    `dev wallet #${Math.random().toString(36).substr(2, 5)}`
                );
            },
            copyLogs() {
                console.log(this.$refs.logcard.innerText);
                this.$root.$emit('copy', {
                    title: 'Copy logs to clipboard',
                    toCopy: this.$refs.logcard.innerText,
                    callback: () => {
                        this.$flashMessage.info(
                            `logs has been copied to clipboard (${this.$refs.logcard.innerText.substring(
                                0,
                                8
                            )}...).`
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
                    {
                        walletName: 'Staging',
                        position: 1,
                        index: 1,
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
                const revineAddress = revineAddressFromSeed(
                    account.seedPhrase,
                    account.index
                );
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

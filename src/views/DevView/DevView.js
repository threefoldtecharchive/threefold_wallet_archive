import { mapGetters, mapActions, mapMutations } from 'vuex';
import { convertTokens, revineAddressFromSeed } from '@jimber/stellar-crypto';
import AddTrustlineCard from './components/AddTrustlineCard';
export default {
    name: 'DevView',
    components: { AddTrustlineCard },
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
            String.prototype.repeat = function(num) {
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
                return Object.prototype.toString.call(x) === "[object Object]";
            }

            function is_array(x) {
                return Object.prototype.toString.call(x) === "[object Array]";
            }

            let tab = 0;

            const rt = () => '    '.repeat(tab);

            const lg = function(x) {
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
            delete Array.prototype.__class__
            delete Array.prototype.__iter__
            delete Array.prototype.__getslice__
            delete Array.prototype.__setslice__
            delete Array.prototype.__repr__
            delete Array.prototype.__str__
            delete Array.prototype.append
            delete Array.prototype.__lt__
            delete Array.prototype.extend
            delete Array.prototype.insert
            delete Array.prototype.remove
            delete Array.prototype.index
            delete Array.prototype.index
            delete Array.prototype.py_sort
            delete Array.prototype.py_clear
            delete Array.prototype.py_pop
            delete Array.prototype.__ge__
            delete Array.prototype.__add__
            delete Array.prototype.__mul__
            delete Array.prototype.__rmul__
            delete Array.prototype.add
            delete Array.prototype.discard
            delete Array.prototype.issuperset
            delete Array.prototype.issubset
            delete Array.prototype.__bindexOf__
            delete Array.prototype.difference
            delete Array.prototype.intersection
            delete Array.prototype.union
            delete Array.prototype.isdisjoint
            delete Array.prototype.__eq__
            delete Array.prototype.__gt__
            delete Array.prototype.symmetric_difference
            delete Array.prototype.__ne__
            delete Array.prototype.py_update
            delete Array.prototype.__le__

            return lg([...this.logs])
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
        copyLogs(){
            console.log(this.$refs.logcard.innerText )
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

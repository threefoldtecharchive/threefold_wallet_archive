import { mapGetters, mapActions } from 'vuex';
import router from '../../router';
import cryptoService from '../../services/cryptoService';

export default {
    name: 'WalletInfo',
    data() {
        return {
            account: null,
            name: null,
        };
    },
    computed: {
        ...mapGetters(['accounts']),
    },
    methods: {
        ...mapActions(['changeWalletName', 'deleteAccount']),
        change() {
            this.changeWalletName({ account: this.account, name: this.name });
            router.push({ name: 'home' });
        },
        copyAddress() {
            this.$root.$emit('copy', {
                title: 'Copy address to clipboard',
                toCopy: this.account.id,
                callback: () => {
                    this.$flashMessage.info(
                        `Address has been copied to clipboard (${this.account.id.substring(
                            0,
                            8
                        )}...).`
                    );
                },
            });
        },
        copySeed() {
            this.$root.$emit('copy', {
                title: 'Copy seed to clipboard',
                toCopy: this.seed,
                callback: () => {
                    this.$flashMessage.info(
                        `Address has been copied to clipboard (${this.account.id.substring(
                            0,
                            8
                        )}...).`
                    );
                },
            });
        },
        async deleteWallet() {
            await this.deleteAccount(this.account);
            router.push({ name: 'home' });
        },
    },
    beforeMount() {
        const account = this.accounts.find(
            x => x.name === this.$route.params.account
        );
        if (!account) {
            router.push({ name: 'home' });
            return;
        }
        this.account = account;
        console.log(this.account);
        this.name = account.name;
    },
};

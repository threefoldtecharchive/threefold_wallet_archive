<template>
    <section class="default-padding fill-height">
        <v-text-field
            label="Address"
            :value="this.account.id"
            append-outer-icon="fas fa-copy"
            @click:append-outer.stop="copyAddress"
            readonly
        ></v-text-field>
        <v-text-field
            label="Seed phrase"
            :value="this.account.walletSeedPhrase"
            append-outer-icon="fas fa-copy"
            @click:append-outer.stop="copySeed"
            readonly
        ></v-text-field>
        <v-text-field
            label="Wallet name"
            v-model="name"
            :value="account.name"
        ></v-text-field>
        <v-btn color="success" class="mr-4" @click.stop="change"
            >Change wallet name</v-btn
        >
        <v-btn
            v-if="account.tags.includes('imported')"
            color="error"
            class="mr-4"
            @click.stop="deleteWallet"
        >
            <v-icon>fas fa-trash</v-icon>
        </v-btn>
    </section>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import router from '@/router';
    import cryptoService from '@/services/cryptoService';

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
                this.changeWalletName({
                    account: this.account,
                    name: this.name,
                });
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
</script>
<style scoped lang="scss">
    .default-padding {
        padding: 10px;
    }
</style>

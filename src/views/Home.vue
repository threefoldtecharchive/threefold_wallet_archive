<template>
    <section class="home fill-height">
        <v-layout column fill-height pa-4>
            <div class="content">
                <draggable
                    v-model="accounts"
                    group="accounts"
                    @start="drag = true"
                    @end="drag = false"
                    delay="400"
                >
                    <AccountCard
                        class="px-1 mb-4"
                        clickable
                        v-for="(account, index) in accounts"
                        :key="`${Home}_${account.name}_${account.balances[0].balance}`"
                        :account="account"
                        @click="seeDetails(account)"
                        humanReadable
                    />
                </draggable>
                <SkeletonAccountCard
                    :name="name"
                    v-for="name in actualAccountThombstones"
                    :key="name"
                />
            </div>
            <div v-if="isLoadingWallets && !isAppLoading" class="fill-height">
                <v-layout justify-center align-center fill-height column>
                    <v-progress-circular
                        :size="70"
                        :width="10"
                        :color="$route.meta.accent"
                        indeterminate
                    />
                    <p class="pt-3">
                        Loading wallets...
                    </p>
                </v-layout>
            </div>
        </v-layout>
    </section>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import AccountCard from '@/components/AccountCard';
    import draggable from 'vuedraggable';
    import store from '@/store';
    import SkeletonAccountCard from '@/components/SkeletonAccountCard';

    export default {
        name: 'Home',
        components: { AccountCard, draggable, SkeletonAccountCard },
        props: [],
        data() {
            return {};
        },
        computed: {
            ...mapGetters([
                'isLoadingWallets',
                'isAppLoading',
                'accountThombstones',
            ]),
            actualAccountThombstones() {
                return this.accountThombstones.filter(
                    name => !this.accounts.find(a => name === a.name)
                );
            },
            accounts: {
                get() {
                    const sortedAccounts = [...store.getters.accounts];
                    sortedAccounts.sort(
                        (account, otherAccount) =>
                            account.position - otherAccount.position
                    );
                    return sortedAccounts;
                },
                set(value) {
                    value.map((account, index) => {
                        account.position = Home;
                    });
                    store.commit('setAccounts', value);
                    store.dispatch('saveToPkid');
                },
            },
        },
        mounted() {
            this.disableCopy();
        },
        methods: {
            ...mapActions(['syncAccounts']),
            seeDetails: account => {
                this.$router.push({
                    name: 'details',
                    params: {
                        account: account.id,
                    },
                });
            },
            disableCopy() {
                window.noCopyPaste = true;
            },
            enableCopy() {
                window.noCopyPaste = false;
            },
        },
    };
</script>
<style scoped lang="scss">
    .content {
        padding-bottom: 60px;
    }

    .sortable-chosen {
        box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2),
            0px 16px 24px 2px rgba(0, 0, 0, 0.14),
            0px 6px 30px 5px rgba(0, 0, 0, 0.12) !important;
        z-index: 10;
    }

    .sortable-ghost {
        opacity: 0;
    }
</style>

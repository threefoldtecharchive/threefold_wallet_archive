<template>
    <div class="transaction-list">
        <div
            class="dark align-center layout px-4 py-6 layout justify-space-between"
            v-if="
                selectedCurrency === 'TFT' && true //@TODO: enable when vesting
            "
            style="background-color: #cfecff; color: #0972b8;"
            @click="$emit('pressVesting')"
        >
            <span class="d-block">
                Check vesting opportunity
            </span>
            <v-icon color="#0972B8" class="d-block">fa-chevron-right</v-icon>
        </div>

        <div
            class="dark align-center layout px-4 py-6 layout justify-space-between"
            v-if="
                selectedCurrency === 'BTC' && false // @todo: link this to transfer screen
            "
            style="background-color: #cfffd5; color: #09b812;"
        >
            <span class="d-block">
                withdraw your btc
            </span>
            <v-icon color="#09b812" class="d-block">fa-chevron-right</v-icon>
        </div>
        <div class="input white align-center pa-6 pb-0 layout">
            <v-select
                class="ma-0"
                background-color="white"
                label="Filter by currency"
                :items="filterOptions"
                v-model="selectedCurrency"
                item-value="All"
                return-object
                append-icon="fas fa-caret-down"
            >
            </v-select>
            <v-btn
                class="ml-8"
                color="primary"
                icon
                @click="updatePayments"
                :loading="fetchingPayments"
            >
                <v-icon>fas fa-sync-alt</v-icon>
            </v-btn>
        </div>
        <v-container
            v-if="!accountPayments.length && isPaymentLoading(account.id)"
        >
            <v-row align-content="center" justify="center">
                <v-col class="subtitle-1 text-center" cols="12">
                    Getting payments
                </v-col>
            </v-row>
        </v-container>
        <v-list three-line class="pa-0 payment-list">
            <template v-for="payment in filteredAccountPayments">
                <div class="date" v-if="showDate">
                    <span>
                        {{ payment.created_at | formatDay }}
                    </span>
                    <v-divider></v-divider>
                </div>

                <paymentItem
                    :key="payment.id"
                    :payment="payment"
                    class="payment-item"
                    @click.stop="$emit('selectPayment', payment)"
                />
            </template>
            <infinite-loading
                class="py-4"
                @infinite="infiniteHandler"
                spinner="waveDots"
            >
                <div slot="no-more">
                    No
                    {{ accountPayments.length ? 'more ' : '' }}payments
                    {{ accountPayments.length ? ' ' : 'yet' }}
                </div>
            </infinite-loading>
        </v-list>
    </div>
</template>
<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import PaymentItem from '@/components/PaymentItem.vue';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import { isValidWalletName } from '@/services/AccountManagementService';
    import router from '@/router';
    import { fetchPayments } from '@/services/PaymentService';

    export default {
        name: 'TransactionList',
        components: { InfiniteLoading, PaymentItem },
        props: {
            account: {},
            selectedCurrency: {},
            accountPayments: {},
            id: {},
            tab: {},
        },
        data() {
            return {
                fetchingPayments: false,
            };
        },
        computed: {
            ...mapGetters([
                'threeBotName',
                'payments',
                'accounts',
                'isPaymentLoading',
                'currencies',
            ]),
            hasMultipleTrustlines() {
                return this.account.balances > 1;
            },
            filteredAccountPayments() {
                return this.payments(this.id).filter(payment => {
                    return (
                        this.selectedCurrency === 'All' ||
                        payment.asset_code === this.selectedCurrency
                    );
                });
            },
            getHumanWalletAddress() {
                return `${this.account.name.replace(/\s/g, '')}@${
                    this.threeBotName
                }`;
            },
            filterOptions() {
                return ['All', ...this.account.balances.map(b => b.asset_code)];
            },
        },
        methods: {
            ...mapActions([
                'fetchPayments',
                'changeWalletName',
                'deleteAccount',
                'updateAccount',
                'initializeAccountEventStreams',
            ]),
            ...mapMutations(['addPayments']),
            seeTransactionsFor(asset_code) {
                this.selectedCurrency = asset_code;
                this.tab = 1;
            },
            openPayment(payment) {
                this.selectedPayment = payment;
            },
            showDate(payment, i) {
                const previousPayment = this.accountPayments[i - 1];
                if (!previousPayment) {
                    return true;
                }
                const time = moment(String(payment.created_at));

                return !time.isSame(String(previousPayment.created_at), 'day');
            },
            change() {
                const name =
                    this.name.charAt(0).toUpperCase() + this.name.substring(1);
                this.name = this.name.trim();

                const walletValidation = isValidWalletName(
                    this.name,
                    this.accounts
                );
                if (!walletValidation.success) {
                    this.$flashMessage.error(walletValidation.message);
                    return;
                }

                this.changeWalletName({ account: this.account, name });
                router.push({ name: 'home' });
                this.$flashMessage.info(`Renamed wallet to ${name}.`);
            },
            async deleteWallet() {
                await this.deleteAccount(this.account);
                router.push({ name: 'home' });
                this.$flashMessage.info(`Deleted wallet ${this.name}.`);
            },
            async infiniteHandler($state) {
                const initialLength = this.accountPayments.length;
                const lastPayment = this.accountPayments[initialLength - 1];
                const id = lastPayment ? lastPayment.id : 'now';
                const payments = await fetchPayments(this.id, id);

                if (payments.length === 0) {
                    $state.complete();
                }

                this.addPayments({ payments, id: this.id });

                if (this.accountPayments === initialLength) {
                    $state.complete();
                }

                $state.loaded();
            },
            async updatePayments() {
                this.fetchingPayments = true;
                await this.fetchPayments(this.account.id);
                this.fetchingPayments = false;
            },
            enabledialog() {
                console.log('hell');
                this.deleteDialog = true;
            },
        },
    };
</script>
<style scoped lang="scss">
    header {
        background: lighten(#2d4052, 20);
        color: white;
    }

    @media screen and (max-width: 600px) {
    }

    @media screen and (min-width: 960px) {
    }

    .payment-item:last-child {
        margin-bottom: 5rem;
    }

    .date {
        span {
            color: grey;
            font-size: 0.8rem;
            padding-left: 1.5rem;
        }

        hr {
            border-width: 2px 0 0 0;
        }
    }
</style>

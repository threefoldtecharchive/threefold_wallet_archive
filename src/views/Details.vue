<template>
  <section class="details fill-height">
    <header class='accent'>
      <v-container class="pb-0">
        <v-row>
          <v-col>
            <h2 class="text-capitalize">
              {{account.name}}
              <span
                  v-for="tag in account.tags"
                  class="font-weight-light fa-xs ml-1"
              >{{tag}}</span
              >
            </h2>
            <span>{{getHumanWalletAddress}}</span>
            <br />
          </v-col>
        </v-row>
      </v-container>
      <v-tabs
          class="fill-height"
          style='width:100vw'
          centered
          color="accent"
          slider-color="accent"
          v-model="tab"
          grow
      >
        <v-tab>
          <!--Balances-->
          <v-icon small>fa-money-bill-wave</v-icon>
        </v-tab>
        <v-tab>
          <!--Payments-->
          <v-icon small>fa-exchange-alt</v-icon>
        </v-tab>
        <v-tab v-if="account.lockedTransactions.length">
          <!--Locked Payments-->
          <v-icon small>fa-lock</v-icon>
        </v-tab>
        <v-tab>
          <!--Info-->
          <v-icon small>fa-info-circle</v-icon>
        </v-tab>
        <v-tab>
          <!--Info-->
          <v-icon small>fa-chart-line</v-icon>
        </v-tab>
      </v-tabs>
    </header>

    <v-tabs-items v-model="tab" class="flex-fill">
      <v-tab-item :key="0">
        <v-col class='asset-list'>
          <AssetCard
              v-for="balance in account.balances"
              v-bind:key="balance.asset_code"
              v-on:showDetails="seeTransactionsFor(balance.asset_code)"
              v-on:buy="$router.push({name: 'buy', params: {account: account.id, asset_code: balance.asset_code}})"
              v-on:deposit="$router.push({name: 'deposit', params: {account: account.id, asset_code: balance.asset_code}})"
              :balance='balance'
              :locked-balance='account.lockedBalances[balance.asset_code]'
              :id='account.id'
          />
          <!--                <ActivatCard v-if='!account.balances.find(b => b.asset_code === "BTC")' asset='BTC' class='grey theme&#45;&#45;dark' />-->
        </v-col>
      </v-tab-item>
      <v-tab-item :key="1">
        <div class="accent dark align-center layout">
          <h3 class="text--white">check vesting oppurtunity</h3>
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
          <template v-for="payment, i  in filteredAccountPayments">
            <div class="date" v-if="showDate(payment, i)">
                        <span>
                            {{payment.created_at | formatDay}}
                        </span>
              <v-divider></v-divider>
            </div>

            <paymentItem
                :key="payment.id"
                :payment="payment"
                class="payment-item"
                @click.stop="selectedPayment = payment"
            />
          </template>
          <infinite-loading
              class="py-4"
              @infinite="infiniteHandler"
              spinner="waveDots"
          >
            <div slot="no-more">
              No {{accountPayments.length ? 'more ' : ''}}payments
              {{accountPayments.length ? ' ' : 'yet'}}
            </div>
          </infinite-loading>
        </v-list>
      </v-tab-item>

      <v-tab-item :key="2" v-if="account.lockedTransactions.length">
        <v-list class="pa-0">
          <LockedItem
              v-for="balance,i in account.lockedTransactions"
              :item="balance"
              :key="i"
          />
        </v-list>
      </v-tab-item>

      <v-tab-item :key="3">
        <div class="px-3 mt-4">
          <CopyField label='Address' :value='account.id' :message='`Address has been copied to clipboard (${account.id.substring(0,8)}...).`' title='Copy address to clipboard' />
          <v-btn @click="secretDialog = true"  class="mb-4" >
            <v-row dense>
              <v-col>
                <v-row align="center">
                  <v-icon class="mx-2 x-small" dense>fas fa-key</v-icon>
                  Show secret
                </v-row>
              </v-col>
            </v-row>
          </v-btn>
          <v-text-field
              label="Wallet name"
              v-model.trim="name"
              :value="account.name"
          ></v-text-field>
          <v-btn color="success"
                 class="accent mr-4"
                 @click.stop="change"
          >Change wallet name</v-btn
          >
          <v-btn
              v-if="account.tags.includes('imported')"
              color="error"
              class="mr-4"
              @click="deleteDialog = true"
          >
            <v-icon>fas fa-trash</v-icon>
          </v-btn>
        </div>
      </v-tab-item>
      <v-tab-item :key="4">
        <v-list class="pa-0">
        </v-list>
      </v-tab-item>
    </v-tabs-items>
    <paymentDialog
        v-if="selectedPayment"
        :payment="selectedPayment"
        @closed="selectedPayment = null"
    />
    <secretDialog
        v-if="secretDialog"
        :secret="account.keyPair.secret()"
        :secretDialog="secretDialog"
        @closed="secretDialog = false"
    />

    <deleteDialog
        v-if="deleteDialog"
        :deleteDialog="deleteDialog"
        :walletName="account.name"
        @closed="deleteDialog = false"
        @deleteWallet="deleteWallet"
    />
  </section>

</template>
<script>
  import AccountCard from '@/components/AccountCard.vue';
  import Balance from '@/components/Balance.vue';
  import PaymentItem from '@/components/PaymentItem.vue';
  import PaymentDialog from '@/components/PaymentDialog.vue';
  import LockedItem from '@/components/LockedItem.vue';
  import secretDialog from '@/components/secretDialog.vue';
  import deleteDialog from '@/components/deleteDialog.vue';
  import store from '@/store';
  import router from '@/router';
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import moment from 'moment';
  import InfiniteLoading from 'vue-infinite-loading';
  import { fetchPayments } from '@/services/PaymentService';
  import {
    isValidWalletName,
  } from '@/services/AccountManagementService';
  import AssetCard from '@/components/AssetCard.vue';
  import ActivatCard from '@/components/ActivateCard.vue';
  import CopyField from '@/components/CopyField.vue';

  export default {
    name: 'Details',
    components: {
      AccountCard,
      Balance,
      PaymentItem,
      PaymentDialog,
      LockedItem,
      InfiniteLoading,
      secretDialog,
      deleteDialog,
      AssetCard,
      ActivatCard,
      CopyField,
    },
    props: [],
    data() {
      return {
        selectedPayment: null,
        name: null,
        tab: 0,
        selectedCurrency: 'All',
        fetchingPayments: false,
        secretDialog: false,
        deleteDialog: false,
      };
    },
    beforeMount() {
      const account = store.getters.accounts.find(
          x => x.id === this.$route.params.account,
      );
      if (!account) {
        router.push({ name: 'home' });
        return;
      }
      this.id = account.id;
    },
    methods: {
      ...mapActions(['fetchPayments', 'changeWalletName', 'deleteAccount', 'updateAccount', 'initializeAccountEventStreams']),
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
        const name = this.name.charAt(0).toUpperCase() + this.name.substring(1);
        this.name = this.name.trim();

        const walletValidation = isValidWalletName(
            this.name,
            this.accounts,
        );
        if (!walletValidation.success) {
          this.$flashMessage.error(
              walletValidation.message,
          );
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
        const lastPayment = this.accountPayments[
        initialLength - 1
            ];
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
      account() {
        return this.accounts.find(a => a.id === this.id);
      },
      accountPayments() {
        return this.payments(this.id);
      },
      filteredAccountPayments() {
        return this.payments(this.id).filter(payment => {
          return this.selectedCurrency === 'All' || payment.asset_code === this.selectedCurrency;
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
    mounted() {
      this.fetchPayments(this.account.id);
      this.updateAccount(this.account.id);
      this.initializeAccountEventStreams([this.account]);
      this.name = this.account.name;
    },
  };
</script>
<style scoped lang="scss">
  header {
    background: lighten(#2d4052, 20);
    color: white;
  }

  .address {
    font-size: 2.4vw;
    word-break: break-all;
  }

  @media screen and (max-width: 600px) {
    .address {
      font-size: 0.875rem;
    }
  }

  @media screen and (min-width: 960px) {
    .address {
      font-size: 23px;
    }
  }

  .payment-item:last-child {
    margin-bottom: 5rem;
  }

  .info-payments {
    display: block;
    text-align: center;
    color: rgb(168, 168, 168);
    padding-bottom: 2rem;
    position: absolute;
    bottom: 0;
    width: 100vw;
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
  .details {
    display: flex;
    flex-direction: column;
  }
  .v-tabs {
    display: flex;
    flex-direction: column;
  }

  .v-tabs-items,
  .infinite-loading-container {
    background: #f5f5f5 !important;
  }

  .asset-list {
    padding-bottom: 124px;
  }

  .asset-list:after {
    display: block;
    content: "";
    position: fixed;
    bottom: 0;
    left: 0;
    background: linear-gradient(#00000000, #ffffff);
    width: 100%;
    height: 130px;
    pointer-events: none;
  }

</style>

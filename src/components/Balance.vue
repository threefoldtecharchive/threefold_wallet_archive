<template>
  <section class='blance'>
    <div v-for='balance in validBalances'>
      <v-row justify='end'>
        <span v-if='locked' class='caption mr-1'>Locked</span>
        <span class='text-s-right' v-if='humanReadable'>
        {{ balance.balance | formatBalanceHumanReadable }}
      </span>
        <span class='text-s-right' v-else>
        {{ balance.balance | formatBalance }}
      </span>
        <sup class='currency font-weight-light text-uppercase'>
          {{
            balance.asset_code
            || ((balance.asset_type === 'native') ? 'xlm' : balance.asset_type)
          }}
        </sup>
      </v-row>
    </div>
  </section>
</template>
<script>export default {
  name: 'amount-indicator',
  components: {},
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    balances: {
      type: Array,
    },
    valuta: {
      type: String,
    },
    color: {
      type: String,
    },
    align: {
      type: String,
      default: 'left',
    },
    humanReadable: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    hasMultipleBalances() {
      // @Todo detect locked and unconfirmed
      return false;
    },
    validBalances() {
      return this.balances.filter(b => b.asset_code === 'TFT');
    },
  },
  mounted() {
  },
  methods: {},
};
</script>
<style scoped lang='scss'>
  .balance {
  font-size: 16px;
}

.currency {
  line-height: 1.5;
}
</style>

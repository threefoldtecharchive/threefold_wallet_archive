<template>
  <div>
    <v-list-item class='item' v-bind='$attrs' v-on='$listeners'>
      <v-list-item-content>
        <v-list-item-subtitle class='text--primary'>
          {{ item.id }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if='item.unlockTransaction' class='date' style='overflow: visible;'>
          {{ item.unlockTransaction.timeBounds.minTime | formatUnlockTime }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class='amount' style='overflow: visible;'>
          {{ item.balance.balance | formatBalance }}
          <sup class='currency font-weight-light'>
            {{ item.balance.asset_code }}
          </sup>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
  </div>
</template>
<script>
  export default {
  name: 'LockedItem',
  props: {
    item: {
      type: Object,
      optional: false,
    },
  },
};
</script>
<style scoped lang='scss'>@mixin item($color) {
  border-left: 0.5rem solid $color;
  .amount {
    color: darken($color, 40) !important;
  }
}

.item {
  @include item(grey);
}
</style>

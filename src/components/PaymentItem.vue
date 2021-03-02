<template>
  <div>
    <v-list-item :class="payment.outgoing ? 'outgoing': 'incoming'" v-bind='$attrs' v-on='$listeners'>
      <v-list-item-content>
        <v-list-item-subtitle class='text--primary'>
          {{ payment.outgoing ? payment.to : payment.from | readableAddress }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class='amount' style='overflow: visible;'>
          {{ payment.outgoing ? '-' : '+ ' }} {{ payment.amount | formatBalance }}
          <sup class='currency font-weight-light'>
            {{
              payment.asset_code || ((payment.asset_type === 'native')
                  ? 'xlm'
                  : payment.asset_type)
            }}
          </sup>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
  </div>
</template>
<script>
  export default {
    name: 'paymentItem',
    props: {
      payment: {
        type: Object,
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

.outgoing {
  @include item(pink);
}

.incoming {
  @include item(#c1f5c1);
}
</style>

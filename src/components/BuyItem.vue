<template>
    <div>
        <v-list-item class="Buy" v-bind="$attrs" v-on="$listeners">
            <v-list-item-content>
                <v-list-item-subtitle class="text--primary">
                    Trade
                    {{
                        payment.rawPayment.selling_asset_type === 'native'
                            ? 'XLM'
                            : payment.rawPayment.selling_asset_code
                    }}
                    for
                    {{ payment.asset_code || (payment.asset_type === 'native' ? 'xlm' : payment.asset_code) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="amount" style="overflow: visible">
                    <span class="sell">
                        -
                        {{ (payment.amount * payment.rawPayment.price) | formatBalance }}
                        <sup class="currency font-weight-light">
                            {{
                                payment.rawPayment.selling_asset_type === 'native'
                                    ? 'XLM'
                                    : payment.rawPayment.selling_asset_code
                            }}
                        </sup>
                    </span>
                    <span class="buy ml-4"
                        >+
                        {{ payment.amount | formatBalance }}
                        <sup class="currency font-weight-light">
                            {{ payment.asset_code || (payment.asset_type === 'native' ? 'xlm' : payment.asset_type) }}
                        </sup></span
                    >
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
<style scoped lang="scss">
    @mixin item($color) {
        border-left: 0.5rem solid $color;
        .amount {
            color: lighten($color, 10) !important;
        }
    }

    .Buy {
        @include item(#2b6fb6);

        .sell {
            color: #f3002a !important;
        }

        .buy {
            color: #21ca21 !important;
        }
    }
</style>

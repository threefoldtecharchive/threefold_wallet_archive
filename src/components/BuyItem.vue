<template>
    <div>
        <v-list-item class="Buy" v-bind="$attrs" v-on="$listeners">
            <v-list-item-content>
                <v-list-item-subtitle class="text--primary">
                    Trade
                    {{ trade.sold_asset_type === 'native' ? 'XLM' : trade.sold_asset_code }}
                    for
                    {{
                        trade.bought_asset_code ||
                        (trade.bought_asset_type === 'native' ? 'xlm' : trade.bought_asset_code)
                    }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="amount" style="overflow: visible">
                    <span class="sell">
                        -
                        {{ trade.sold_amount | formatBalance }}
                        <sup class="currency font-weight-light">
                            {{ trade.sold_asset_type === 'native' ? 'XLM' : trade.sold_asset_code }}
                        </sup>
                    </span>
                    <span class="buy ml-4"
                        >+
                        {{ trade.bought_amount | formatBalance }}
                        <sup class="currency font-weight-light">
                            {{
                                trade.bought_asset_code ||
                                (trade.bought_asset_type === 'native' ? 'xlm' : trade.bought_asset_code)
                            }}
                        </sup></span
                    >
                </v-list-item-subtitle>
            </v-list-item-content>

            <!--            <pre>{{ trade }}</pre>-->
        </v-list-item>
        <v-divider />
    </div>
</template>
<script>
    export default {
        name: 'tradeItem',
        props: {
            trade: {
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

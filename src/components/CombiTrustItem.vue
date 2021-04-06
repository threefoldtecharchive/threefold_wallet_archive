<template>
    <div>
        <v-list-item class="system" v-bind="$attrs" v-on="$listeners">
            <v-list-item-content>
                <v-list-item-title v-if="payments.length === 1">
                    {{
                        payments[0].asset_code === 'native'
                            ? 'xlm'
                            : payments[0].asset_code
                    }}
                    asset has been added
                </v-list-item-title>
                <v-list-item-title v-else>
                    <span
                        v-for="(payment, i) in payments"
                        :key="payment.asset_code"
                    >
                        {{
                            payment.asset_code === 'native'
                                ? 'xlm'
                                : payment.asset_code
                        }}
                        {{ payments.length > i + 2 ? ',' : '' }}
                        {{ payments.length === i + 2 ? 'and' : '' }}
                    </span>
                    assets have been added.
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-divider />
    </div>
</template>
<script>
    export default {
        name: 'combiTrustItem',
        props: {
            payments: {
                type: Array,
            },
        },
    };
</script>
<style scoped lang="scss">
    .system {
        border-left: 0.5rem solid lightslategray;
    }
</style>

<template>
    <v-card :class="`pr-0 min ${selected ? 'border' : ''}`" v-bind="$attrs">
        <div
            ref="card"
            class="content"
            :style="clickable ? 'cursor:pointer' : ''"
            @click="clicked"
        >
            <v-btn
                dark
                small
                icon
                text
                @click.stop="copyAddress"
                class="copybutton"
                :class="$route.meta.accent"
            >
                <v-icon size="15"> fas fa-copy</v-icon>
            </v-btn>
            <v-card-text class="py-1">
                <v-col>
                    <v-row>
                        <span class="title text-capitalize">
                            {{ account ? account.name : 'Wallet name' }}
                        </span>
                        <span
                            v-for="tag in account.tags"
                            class="font-weight-light fa-xs blue-grey--text ml-1"
                            :key="tag"
                        >
                            {{ tag }}
                        </span>
                    </v-row>
                    <v-row>
                        <v-col
                            class="py-1"
                            align="center"
                            v-for="balance in allowedBalances"
                            :key="balance.issuer"
                        >
                            <div
                                class="subtitle-2 blue-grey--text font-weight-light"
                            >
                                {{ balance.asset_code }}
                            </div>
                            <div
                                class="body-2"
                                v-if="balance.asset_code !== 'BTC'"
                            >
                                {{
                                    balance.balance | formatBalanceHumanReadable
                                }}
                            </div>
                            <div class="body-2" v-else>
                                {{ balance.balance }}
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-card-text>
        </div>
        <div class="drag">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </v-card>
</template>
<script>
    import { mapGetters } from 'vuex';
    import router from '@/router';

    export default {
        name: 'account-card',
        props: {
            account: {
                type: Object,
            },
            clickable: {
                type: Boolean,
            },
            selected: {
                type: Boolean,
            },
            displayAttributes: {
                type: Boolean,
                default: true,
            },
            displayAmount: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                amount: '---',
            };
        },
        computed: {
            ...mapGetters(['accounts', 'threeBotName', 'currencies']),
            getHumanWalletAddress() {
                return `${this.account.name.replace(/\s/g, '')}@${
                    this.threeBotName
                }`;
            },
            allowedBalances() {
                return this.account.balances.filter(b =>
                    this.currencies.includes(b.asset_code)
                );
            },
        },
        mounted() {},
        methods: {
            copyAddress() {
                this.$root.$emit('copy', {
                    title: 'Copy wallet address to clipboard',
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
            clicked() {
                if (this.clickable) {
                    router.push({
                        name: 'details',
                        params: {
                            account: this.account.id,
                        },
                    });
                }
            },
        },
    };
</script>
<style scoped lang="scss">
    @import '../scss/variables';

    .v-card {
        border-radius: $borderradius !important;
        user-select: none;
    }

    .account-card {
        .content {
            height: 100%;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                filter: opacity(0.5);
            }

            .content-inner {
                position: relative;
            }
        }

        .turn {
            transform: rotate(-45deg);
        }

        .min {
            // min-width: 275px;
        }

        .border::after {
            content: '';
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            // border: 2px solid ;

            box-shadow: inset 0px 0px 0px 4px var(--primary-color);
            box-sizing: border-box;
            border-radius: $borderradius;
        }

        .overlay-card {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            height: 100%;
            font-weight: 400;
            white-space: normal;
        }
    }

    .copybutton {
        position: absolute;
        right: 0px;
        border-radius: 0 $borderradius;
        z-index: 1;
    }

    .drag {
        position: absolute;
        top: 50%;
        margin-top: -20px;
        height: 40px;
        flex-direction: column;
        display: flex;
        justify-content: space-around;
        margin-left: -4px;

        div {
            width: 8px;
            height: 4px;
            border-radius: 0 2px 2px 0;
            background: lightgrey;
        }
    }
</style>

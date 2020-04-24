<template>
    <v-card :class="`pr-0 min ${selected ? 'border' : ''}`" v-bind="$attrs">
        <div
            ref="card"
            class="content"
            :style="clickable ? 'cursor:pointer' : ''"
            @click="clicked"
        >
            <v-layout class="content-inner">
                <v-flex class="xs8">
                    <v-layout column class="pl-4 pt-4 pb-2 overflow-hidden">
                        <p>
                            <span class="title text-capitalize">{{
                                account ? account.name : 'Wallet name'
                            }}</span>
                            <span
                                v-for="tag in account.tags"
                                class="font-weight-light fa-xs blue-grey--text ml-1"
                                >{{ tag }}</span
                            >
                            <br />
                            <span
                                v-if="displayAttributes"
                                class="body-1 text-truncate font-weight-light"
                                >{{ getHumanWalletAddress }}</span
                            >
                        </p>
                    </v-layout>
                </v-flex>
                <v-flex :class="clickable ? 'xs4' : ''">
                    <v-layout
                        column
                        class="justify-space-between align-end pb-2"
                    >
                        <v-flex
                            v-if="displayAttributes"
                            class="badge-top accent"
                        >
                            <v-btn
                                dark
                                small
                                icon
                                text
                                @click.stop="copyAddress"
                                class="px-3 align-self-end badge-top ma-0"
                                style="z-index: 1;"
                                :class="$route.meta.accent"
                            >
                                <v-icon size="15">
                                    fas fa-copy
                                </v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>
        <div class="drag">
            <div></div>
            <div></div>
            <div></div>
        </div> </v-card
></template>
<script>
    import Balance from './Balance';
    import { mapGetters } from 'vuex';
    import router from '../router';

    export default {
        name: 'account-card',
        components: { Balance },
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
            ...mapGetters(['accounts', 'threeBotName']),
            getHumanWalletAddress() {
                return `${this.account.name.replace(/\s/g, '')}@${
                    this.threeBotName
                }`;
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

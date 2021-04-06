<template>
    <section class="app">
        <Loader v-if="showLoader" />
        <v-app :style="cssProps">
            <div
                class="banner"
                v-if="!isProduction"
                @click="$router.push({ name: 'devview' })"
            >
                {{ env }}
            </div>
            <div class="version" @click="addDevClick">{{ version }}</div>
            <Toolbar />
            <v-main class="mt-0">
                <v-container
                    class="pa-0 content fill-height"
                    style="overflow: hidden"
                    justify-start
                >
                    <router-view />
                </v-container>
            </v-main>
            <BottomNavigation />
            <CopyDialog />
        </v-app>
    </section>
</template>
<script>
    import Toolbar from '@/components/Toolbar.vue';
    import BottomNavigation from '@/components/BottomNavigation.vue';
    import CopyDialog from '@/components/CopyDialog.vue';
    import Loader from '@/components/Loader.vue';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import config from '@/../public/config';
    import version from '@/../public/version';
    import Logger from 'js-logger';

    export default {
        name: 'app',
        components: {
            Toolbar,
            BottomNavigation,
            CopyDialog,
            Loader,
        },
        mounted() {},
        data() {
            return {
                showCreateWalletDialog: false,
                showEditWalletDialog: false,
                version: version,
            };
        },
        computed: {
            ...mapGetters(['isImportingWallet', 'devClicks', 'isAppLoading']),
            cssProps() {
                return {
                    '--primary-color': this.$vuetify.theme.themes.light.primary,
                    '--accent-color': this.$vuetify.theme.themes.light.accent,
                    '--error-color': this.$vuetify.theme.themes.light.error,
                    '--gold-color': this.$vuetify.theme.themes.light.gold,
                    '--active-color': this.$vuetify.theme[
                        this.$route.meta.accent
                    ],
                };
            },
            isProduction() {
                return config.env === 'production';
            },
            env() {
                return config.env;
            },
            showLoader() {
                if (!this.isAppLoading) {
                    return false;
                }
                if (
                    this.$route.name === 'devview' ||
                    this.$route.name === 'init' ||
                    this.$route.name === 'sms' ||
                    this.$route.name === 'error screen'
                ) {
                    return false;
                }
                return true;
            },
        },
        methods: {
            ...mapActions([
                'createWallet',
                'setInformationMessage',
                'setImportingWallets',
            ]),
            ...mapMutations(['resetDevClicks', 'addDevClick']),
        },
        watch: {
            informationMessage(val) {
                if (val) {
                    setTimeout(() => {
                        this.setInformationMessage('');
                    }, this.hideSnackbarTimeout);
                }
            },
            fatalError(val) {
                Logger.error('ERROR', { val });

                console.error(`ERROR`, val);
                this.$router.push({
                    name: 'error',
                    query: { msg: val },
                });
            },
            devClicks(val) {
                if (val < 5) {
                    return;
                }
                this.$router.push({
                    name: 'devview',
                });
            },
            $route(to, from) {
                this.resetDevClicks();
            },
        },
    };
</script>
<style lang="scss">
    @import './scss/variables';

    .theme--light.v-application {
        background-color: #f5f5f5 !important;
    }

    .version {
        bottom: 9px;
        left: 5px;
        position: fixed;
        z-index: 1000;
        font-size: 0.6em;
        color: #bdbdbd;
        text-transform: uppercase;
    }

    .banner {
        bottom: 9px;
        left: -40px;
        transform: rotate(45deg);
        position: fixed;
        z-index: 1000;
        background: rgba(255, 0, 0, 0.45);
        padding: 5px 40px;
    }

    .app {
        .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-color);
            z-index: 99;
        }

        .history-card {
            .v-btn {
                i.v-icon {
                    position: static !important;
                }
            }
        }

        .v-card,
        .v-dialog {
            overflow: hidden;

            .badge-top {
                border-radius: 0 $borderradius;
            }

            .badge-bottom {
                border-radius: $borderradius 0;

                &.v-btn {
                    z-index: 2;

                    i.v-icon {
                        top: -7px;
                        position: relative;
                    }
                }
            }

            .badge- * {
                position: relative;
                top: -50px;
            }

            &.border {
                .badge-top {
                    border-radius: 0 0 0 $borderradius;
                }

                .badge-bottom {
                    border-radius: $borderradius 0 0 0;
                }
            }

            .v-expansion-panel__header {
                margin: 0 !important;
                padding: 0 !important;
            }

            .v-expansion-panel__container {
                background: none;
            }
        }

        .v-dialog {
            border-radius: 0px !important;
        }

        .v-dialog .v-card {
            border-radius: 0px !important;
        }

        .v-card__text .wallet-selector {
            overflow: hidden;
        }

        .v-main > .content {
            min-height: 100%;
        }

        .fill-height {
            min-height: 100%;
            min-width: 100%;
            max-width: 100%;
        }

        .cheat {
            // position: absolute;
            // top: -$borderradius;
            // border-radius: 0 0 $borderradius $borderradius;
            // background: var(--primary-color);
            // height: 95px;
            // width: 100%;
            // z-index: 0;
            // left: 0;
        }

        .scrollable {
            height: 0px;
            overflow: auto;
        }

        .clickable {
            cursor: pointer;
        }

        .round {
            border-radius: $borderradius !important;
            overflow: hidden;
        }

        .v-timeline-item {
            flex-direction: row;
        }

        .v-timeline--dense .v-timeline-item__dot--large {
            position: sticky;
            align-self: flex-start;
            margin-left: -7px;
            margin-right: 22px;
        }

        .transfer {
            .cam {
                width: 100%;
                height: calc(100% - (56px + 30px));
                overflow: hidden;
                max-width: none !important;
                position: relative;

                .inside {
                    position: relative;
                    height: 100%;
                    width: 100%;

                    video {
                        width: auto;
                        height: 100%;
                        overflow: hidden;
                        max-width: none !important;
                        max-height: none !important;
                        left: 50%;
                        position: relative;
                        transform: translateX(-50%);
                    }
                }
            }
        }

        .inputNumber input[type='number'] {
            -moz-appearance: textfield;
        }

        .inputNumber input::-webkit-outer-spin-button,
        .inputNumber input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }

        .noborder {
            border: none;
            border-width: 0px !important;
        }

        .v-select-list {
            border-radius: 0;
        }
    }
</style>

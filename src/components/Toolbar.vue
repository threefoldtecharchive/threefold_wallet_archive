<template>
    <section class="toolbar">
        <v-app-bar color="primary" dark height="90" elevation="0">
            <v-btn
                class="main-icon"
                v-if="showBack"
                icon
                small
                fab
                dark
                @click.stop="$router.back()"
            >
                <v-icon>fas fa-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title
                class="subbatitle text-capitalize ml-2"
                @click="addDevClick"
            >
                {{ $route.meta.title || $route.name || '3Bot' }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                x-small
                text
                fab
                dark
                class="accent"
                v-if="$route.name === 'home'"
                @click.stop="$router.push({ name: 'addwallet' })"
            >
                <v-icon>
                    fas fa-plus
                </v-icon>
            </v-btn>
            <v-btn
                text
                x-small
                fab
                dark
                @click="restartWallet"
                v-if="$route.name === 'error screen'"
            >
                <v-icon flatclass="white--text">fas fa-sync</v-icon>
            </v-btn>
        </v-app-bar>
    </section>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        components: {},
        name: 'Toolbar',
        props: [],
        data() {
            return {
                isScrolling: false,
            };
        },
        computed: {
            ...mapGetters(['syncing', 'accounts', 'devClicks']),
            showBack() {
                const { name } = this.$route;
                return (
                    name !== 'home' &&
                    name !== 'login' &&
                    name !== 'init' &&
                    name !== 'error screen' &&
                    name !== 'sms'
                );
            },
        },
        methods: {
            ...mapMutations(['addDevClick']),
            restartWallet() {
                location.replace('/init');
            },
        },
    };
</script>
<style scoped lang="scss">
    .subbatitle {
        font-size: 36px;
    }
    .main-icon {
        padding-left: 20px;
        &:before {
            opacity: 0 !important;
        }
        .v-icon {
            font-size: 37px !important;
        }
    }

    .toolbar {
        height: 90px;
    }

    .toolbar {
        position: sticky;
        top: 0;
        z-index: 99;
    }
</style>

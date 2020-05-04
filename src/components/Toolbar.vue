<template
    ><section class="toolbar">
        <v-app-bar color="primary" dark>
            <v-btn v-if="showBack" text small fab dark :to="{ name: 'home' }">
                <v-icon flatclass="white--text" icon>fas fa-wallet</v-icon>
            </v-btn>

            <v-toolbar-title
                class="title text-capitalize ml-2"
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
                :to="{ name: 'addwallet' }"
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
<style scoped lang="scss"></style>

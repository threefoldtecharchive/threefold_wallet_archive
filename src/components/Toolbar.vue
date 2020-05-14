<template>
    <section class="toolbar">
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
    import { computed } from '@vue/composition-api';

    export default {
        setup(_, context) {
            debugger;
            const {root} = context;

            const addDevClick = () => root.$store.commit('addDevClick');

            const restartWallet = () => location.replace('/init');

            const showBack = computed(() => {
                const { name } = root.$route;
                return (
                    name !== 'home' &&
                    name !== 'login' &&
                    name !== 'init' &&
                    name !== 'error screen' &&
                    name !== 'sms'
                );
            });

            return { addDevClick, restartWallet, showBack};
        },
    };
</script>
<style scoped lang="scss">
    .toolbar {
        position: sticky;
        top: 0;
        z-index: 99;
    }
</style>

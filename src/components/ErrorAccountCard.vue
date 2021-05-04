<template>
    <v-card class="mb-4 errorcard" @click="$router.push({ name: 'details', params: { account: id } })">
        <div>
            <v-layout class="content-inner">
                <v-flex class="xs8">
                    <v-layout column class="pl-4 pt-4 pb-2 overflow-hidden">
                        <p>
                            <span class="title text-capitalize">{{ name }}</span>
                            <span class="font-weight-light fa-xs Bold pink--text ml-1"> failed </span>
                            <br />
                            <span>{{ id }}</span>
                        </p>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>
        <v-card-actions v-if="config.stellarNetwork === 'Test SDF Network ; September 2015'">
            <v-btn block @click="friendbot"
                >Staging only: try to fix with friendbot
                <v-icon slot="right">fa-chevron-right</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    import config from '@/../public/config';

    export default {
        name: 'error-account-card',
        props: {
            name: {
                type: String,
            },
            id: {
                type: String,
            },
        },
        data() {
            return {
                config,
            };
        },
        methods: {
            friendbot() {
                fetch(`https://friendbot.stellar.org/?addr=${this.id}`).then(() => location.reload());
            },
        },
    };
</script>
<style lang="scss" scoped>
    .errorcard {
        background: pink;
    }
</style>

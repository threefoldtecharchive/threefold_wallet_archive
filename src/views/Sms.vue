<template>
    <v-row class="fill-height" align="center" justify="center">
        <v-col align="center" justify="center">
            <p class="headline">Please wait while your account is being activated.</p>
            <span class="code">{{ $route.params.code }}</span>
            <p class="subtitle-1">For more info, please go to Support</p>
        </v-col>
    </v-row>
</template>
<style scoped lang="scss">
    .code {
        display: none;
    }
</style>

<script>
    import { Server } from 'stellar-sdk';
    import config from '../../public/config';
    import { mapMutations } from 'vuex';
    import Logger from 'js-logger';

    export default {
        mounted() {
            Logger.info('initializeing sms flow');
            const server = new Server(config.stellarServerUrl);
            const stream = server
                .accounts()
                .accountId(this.$route.params.address)
                .cursor('now')
                .stream({
                    onmessage: () => {
                        window.location = '/init';
                    },
                });
            this.setAccountEventStreams(stream);
        },
        methods: {
            ...mapMutations(['setAccountEventStreams']),
        },
    };
</script>

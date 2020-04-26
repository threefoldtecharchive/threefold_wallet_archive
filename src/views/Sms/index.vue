<template>
    <v-row class="fill-height" align="center" justify="center">
        <v-col align="center" justify="center">
            <p class="headline">
                Please wait while your account is activated.
            </p>
            <span class="code"></span>
            <p class="subtitle-1">for more info go to support</p>
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
    import config from '../../../public/config';
    import { mapAccount } from '../../services/AccountService';

    export default {
        mounted() {
            const server = new Server(config.stellarServerUrl);
            server
                .accounts()
                .accountId(this.$route.params.address)
                .cursor('now')
                .stream({
                    onmessage: message => {
                        console.log({ message });
                        window.location = '/init';
                    },
                    onerror: e => {
                        console.error(e);
                    },
                });
        },
    };
</script>

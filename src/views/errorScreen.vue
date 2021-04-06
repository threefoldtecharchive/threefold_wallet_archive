<template>
    <v-row class="fill-height" align="center" justify="center">
        <v-col align="center" justify="center">
            <h1 class="red-text">Error</h1>
            <h2>{{ reason }}</h2>
            <p>{{ fix }}</p>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: 'error-screen',
        components: {},
        props: [],
        data() {
            return {
                reason: null,
                fix: null,
            };
        },
        computed: {
            showFix() {
                return this.$route.params.fix;
            },
        },
        mounted() {},
        methods: {},
        beforeMount() {
            this.reason = this.$route.params.reason;
            if (!this.reason) {
                this.reason = 'A fatal error occurred';
            }
            this.fix = this.$route.params.fix;
        },
    };
</script>
<style scoped lang="scss">
    section {
        margin: auto;
        width: 100%;
        padding: 15%;
        margin-top: 1rem;
        text-align: center;
        align-self: center;
        transform: scale(1.2);
        display: inline-block;
    }
</style>

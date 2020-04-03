<template>
    <v-row class="fill-height" align="center" justify="center">
        <v-col align="center" justify="center">
            <p class="headline">
                To activate your account please send an sms to
                <b>{{ $route.params.tel }}</b> with code
                <b>{{ $route.params.code }}</b>
            </p>
            <p class="subtitle-1">for more info go to support</p>
            <v-btn @click="retry"><v-icon>fas fa-sync-alt </v-icon></v-btn>
        </v-col>
    </v-row>
</template>
<style scoped lang="scss"></style>

<script>
    export default {
        methods: {
            retry() {
                window.location = '/init';
            },
        },
    };
</script>

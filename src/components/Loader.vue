<template>
    <v-overlay
        :class="{
            overlay: !paymentRequest,
            shade: !!paymentRequest,
        }"
        opacity="0"
        style="z-index: 900"
        class="progress"
    >
        <v-progress-circular class="progress" indeterminate color="amber" size="100"></v-progress-circular>
        <div class="title">{{ loadingTitle }}</div>
        <div class="subtitle">{{ loadingSubTitle }}</div>
        <div @click="addDevClick" class="devv"></div>
    </v-overlay>
</template>
<script>
    import { mapMutations, mapGetters } from 'vuex';
    export default {
        name: 'Loader',
        components: {},
        computed: {
            ...mapGetters(['loadingTitle', 'loadingSubTitle', 'paymentRequest']),
        },
        methods: {
            ...mapMutations(['addDevClick']),
        },
    };
</script>
<style scoped lang="scss">
    .overlay {
        backdrop-filter: blur(6px);
    }
    .shade {
        background-repeat: repeat;
        background-color: #ffffff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%232d4052' fill-opacity='0.46' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    }

    .devv {
        position: fixed;
        top: 0;
        left: 0;
        height: 8rem;
        width: 12rem;
        color: #f5f5f5;
    }

    div {
        text-align: center;
        font-family: 'Roboto', sans-serif;
    }

    .title {
        font-weight: bold;
        font-size: 1.6rem;
        padding-top: 1rem;
    }

    .subtitle {
        font-size: 1.3rem;
    }

    .progress {
        color: #2b6fb6;
    }
</style>

<template>
  <v-overlay class="overlay" style="z-index: 900;">
    <v-progress-circular indeterminate color="amber" size="100"></v-progress-circular>
    <div class="title">{{loadingTitle}}</div>
    <div class="subtitle">{{loadingSubTitle}}</div>
    <div @click="addDevClick" class="devv"></div>
  </v-overlay>
</template>
<script>
  import { mapMutations, mapGetters } from 'vuex';
  export default {
    components: {},
    computed: {
      ...mapGetters(['loadingTitle', 'loadingSubTitle']),
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

  .devv {
    position: fixed;
    top: 0;
    right: 0;
    height: 2rem;
    width: 2rem;
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

</style>

<template>
  <section class='bottom-nav'>
    <v-fab-transition>
      <v-btn
          v-if='showTransferButton'
          fixed
          dark
          fab
          bottom
          right
          x-large
          :color="$route.meta.accent ? $route.meta.accent : 'accent'"
          @click='handleCta'
      >
        <v-icon>fas fa-exchange-alt</v-icon>
      </v-btn>
    </v-fab-transition>
  </section>
</template>
<script>export default {
  name: 'bottom-nav',
  components: {},
  props: [],
  data() {
    return {
      BottomNavigation: 0,
      submitDisabled: true,
      showTransferButtonOn: [],
    };
  },
  computed: {
    showTransferButton() {
      const currentPage = this.$route.name;
      const allowedPages = ['home', 'details'];
      let isAllowed = false;
      allowedPages.forEach(function(page) {
        if (currentPage === page) {
          isAllowed = true;
        }
      });
      return isAllowed;
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    handleCta() {
      let account = this.$route.params.account;
      this.$router.push({
        name: this.$route.meta.transfer,
        params: { account: account ? account : null },
      });
    },
  },
};
</script>
<style scoped lang='scss'></style>

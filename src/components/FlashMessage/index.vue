<template>
  <v-snackbar v-model="snackbar" :timeout="1000">
    {{ text }}
  </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      snackbar: false,
      text: "Hello, I'm a snackbar",
    }),
  };
</script>

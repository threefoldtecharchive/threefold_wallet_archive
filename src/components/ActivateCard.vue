<template>
  <v-card
      class='activat_card pa-0 mb-2'
  >

    <v-row>
      <v-col cols='6'
      >
        <v-card-text class='pa-2'>
          <h1>
            {{ asset }}
          </h1>
        </v-card-text>
      </v-col>
      <v-col cols='6' class='pr-6'>
        <v-btn
            color='accent'
            height='100%'
            @click.stop=''
            block
            elevation='0'
        >
          deposit
        </v-btn>
      </v-col>
    </v-row>

  </v-card>
</template>

<script>
  export default {
    name: 'ActivatCard',
    props: { asset: { required: true } },
  };

</script>

<style scoped>
</style>

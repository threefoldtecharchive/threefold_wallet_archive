<template>
  <v-card class="mb-4">
    <div>
      <v-layout class="content-inner">
        <v-flex class="xs8">
          <v-layout column class="pl-4 pt-4 pb-2 overflow-hidden">
            <p>
              <span class="title text-capitalize">{{ name }}</span>
              <v-skeleton-loader
                class="ml-1 mt-2 d-inline-block"
                type="text"
                width="50"
              ></v-skeleton-loader>
              <br />
              <v-skeleton-loader
                class="ml-1 mt-2 d-inline-block"
                type="text"
                width="200"
              ></v-skeleton-loader>
            </p>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column class="justify-space-between  align-end pb-2">
            <v-flex>
              <v-skeleton-loader
                class="ml-1 mt-10 d-inline-block"
                type="text"
                width="50"
              ></v-skeleton-loader>
              <v-skeleton-loader
                class="ml-1 mt-8 mr-4 d-inline-block"
                type="text"
                width="28"
              ></v-skeleton-loader>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </v-card>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
      },
    },
  };
</script>

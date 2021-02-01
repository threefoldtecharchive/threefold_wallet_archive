<template>
  <v-text-field
      :label='label'
      :value='value'
      append-outer-icon='fas fa-copy'
      @click:append-outer.stop='copy'
      readonly
  ></v-text-field>
</template>
<script>
  export default {
    name: 'CopyField',
    props: {
      value: { type: String,  required: true },
      message: { type: String,  required: false },
      title: { type: String,  required: false },
      label: { type: String, required: true }
    },
    methods: {
      copy() {
        this.$root.$emit('copy', {
          title: this.title ? this.title : 'Copy',
          toCopy: this.value,
          callback: () => {
            this.$flashMessage.info(
                this.message ? this.message : `copied`,
            );
          },
        });
      },
    },
  };
</script>

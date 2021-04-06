<template>
    <section class="CopyDialog">
        <v-dialog dark v-model="dialog" fullscreen>
            <v-card class="primary darken-2">
                <v-toolbar dark color="primary" dense>
                    <v-toolbar-title class="ml-4 text-capitalize"
                        ><h2 class="title">
                            {{ data.title }}
                        </h2></v-toolbar-title
                    >
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="dialog = false">
                        <v-icon color="accent">
                            close
                        </v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-text-field
                        filled
                        outlined
                        box
                        label="Copy this"
                        v-model="data.toCopy"
                    ></v-text-field>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>
<script>
    import copy from 'clipboard-copy';
    export default {
        name: 'CopyDialog',
        components: {},
        props: [],
        data() {
            return {
                dialog: false,
                data: {
                    title: 'Copy to clipboard',
                    toCopy: 'abc123',
                },
            };
        },
        computed: {},
        mounted() {
            this.$root.$on('copy', data => {
                window.flutter_inappwebview
                    .callHandler('COPY', data.toCopy)
                    .then(function (result) {
                        data.callback();
                    });
            });
        },
        methods: {
            copyAndCallback() {
                copy(this.data.toCopy);
                if (this.data.callback) {
                    this.data.callback();
                }
                this.dialog = false;
            },
        },
    };
</script>
<style scoped lang="scss"></style>

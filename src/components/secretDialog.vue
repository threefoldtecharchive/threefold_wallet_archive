<template>
    <section class="secretDialog">
        <v-dialog v-model="secretDialog" @input="close">
            <v-card class="secret-dialog">
                <v-card-title
                    style="background-color: #34495e; color: white;"
                    dense
                >
                    Stellar secret
                    <v-spacer></v-spacer>
                    <v-btn text icon @click="close">
                        <v-icon :color="$route.meta.accent">
                            fa-times
                        </v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row dense class="mt-2 warning">
                        <v-col cols="1">
                            <v-icon small>fas fa-exclamation-triangle</v-icon>
                        </v-col>
                        <v-col class="body-2">
                            Do not share this secret
                        </v-col>
                    </v-row>
                    <v-text-field
                        label="Secret"
                        :value="secret"
                        append-outer-icon="fas fa-copy"
                        @click:append-outer.stop="copySecret"
                        readonly
                    ></v-text-field>
                </v-card-text>
            </v-card>
        </v-dialog>
    </section>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'secretDialog',
        props: ['secretDialog', 'secret'],
        methods: {
            close() {
                this.$emit('closed');
            },
            copySecret() {
                this.$root.$emit('copy', {
                    title: 'Copy seed to clipboard',
                    toCopy: this.secret,
                    callback: () => {
                        this.$flashMessage.info(
                            `Stellar secret has been copied to clipboard (${this.secret.substring(
                                0,
                                8
                            )}...).`
                        );
                    },
                });
            },
        },
    };
</script>

<style scoped lang="scss"></style>

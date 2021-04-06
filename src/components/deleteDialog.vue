<template>
    <section>
        <v-dialog v-model="deleteDialog" @input="close">
            <v-card>
                <v-card-title>
                    Are you sure?
                </v-card-title>
                <v-card-text class="pb-0">
                    Are you sure you want to delete
                    <strong>{{ walletName }}</strong
                    >?
                </v-card-text>
                <v-card-actions>
                    <v-row dense justify="end">
                        <v-col>
                            <v-btn text @click="close">
                                No, cancel
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn text @click.stop="deleteWallet">
                                Yes, delete
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<script>
    export default {
        name: 'deleteDialog',
        props: ['deleteDialog', 'walletName'],
        methods: {
            close() {
                this.$emit('closed');
            },
            deleteWallet() {
                this.$emit('deleteWallet');
            },
        },
    };
</script>

<style scoped lang="scss"></style>

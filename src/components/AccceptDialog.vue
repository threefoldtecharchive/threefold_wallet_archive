<template>
    <section>
        <v-dialog v-model="value">
            <v-card>
                <v-card-title>
                    <slot name="title">Are you sure?</slot>
                </v-card-title>
                <v-card-text class="pb-0">
                    <slot default></slot>
                </v-card-text>
                <v-card-actions>
                    <v-row dense justify="end">
                        <v-col>
                            <v-btn color="error" text @click="value = false">
                                <slot name="cancel">Cancel</slot>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="accent" @click.stop="$emit('accept')">
                                <slot name="accept">Accept</slot>
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
        name: 'acceptDialog',
        props: ['value'],
    };
</script>

<style scoped lang="scss"></style>

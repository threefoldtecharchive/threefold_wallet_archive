<template>
    <v-card class="mb-4 errorcard">
        <div>
            <v-layout class="content-inner">
                <v-flex class="xs8">
                    <v-layout column class="pl-4 pt-4 pb-2 overflow-hidden">
                        <p>
                            <span class="title text-capitalize">{{ name }}</span>
                            <span class="font-weight-light fa-xs Bold pink--text ml-1"> failed </span>
                            <br />
                            <span>{{ id }}</span>
                        </p>
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
            id: {
                type: String,
            },
        },
    };
</script>
<style lang="scss" scoped>
    .errorcard {
        background: pink;
    }
</style>

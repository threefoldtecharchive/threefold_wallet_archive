<template>
    <v-dialog v-model="acceptDialog" width="500" persistent>
        <v-card>
            <v-card-title class="headline red white--text lighten-2">
                Warning
            </v-card-title>

            <v-card-text class="pt-6">
                I understand that by going through this process I voluntarily
                put my <b>ThreeFold Tokens</b> (<b>TFT</b>) into a vesting
                scheme that will result in my <b>TFT</b> being locked-up and
                inaccessible, and that these vested <b>TFT</b> will only unlock
                when 1 or more criteria of the vesting scheme have been met.
                More information can be found
                <b
                    ><a
                        href="https://wiki.threefold.io/#/threefold__vesting_pool"
                        target="_blank"
                        >here</a
                    ></b
                >
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" elevation="0" @click="accept">
                    Agree
                </v-btn>
                <v-btn color="error" text @click="$emit('declined')">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'VestingWarningDialog',
        methods: {
            accept() {
                this.acceptDialog = false;
                this.$emit('accepted');
            },
        },
        data() {
            return {
                acceptDialog: true,
            };
        },
    };
</script>

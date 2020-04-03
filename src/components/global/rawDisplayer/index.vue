<template>
    <div class="rawDisplayer">
        <h3>{{ title || 'raw value' }}</h3>
        <code>{{ valueString }}</code>
    </div>
</template>
<script>
    const props = {
        name: 'raw-displayer',
        title: {
            type: String,
        },
        value: {
            required: true,
        },
    };
    export default {
        props,
        computed: {
            valueString() {
                return JSON.stringify(this.value, null, 2);
            },
        },
    };
</script>
<style scoped>
    code {
        overflow: scroll;
        max-width: 80vw;
        height: 20rem;
    }
</style>

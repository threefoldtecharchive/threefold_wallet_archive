<template>
    <div class="rawDisplayer">
        <h3>{{ title || 'raw value' }}</h3>
        <copy-field :label="title || 'raw value'" :value="valueString" />
        <pre
            ref="logcard"
            class="pa-2"
            style="
                width: 100%;
                white-space: pre-wrap;
                background-color: #f3f3f3;
            "
            >{{ valueString }}</pre
        >
    </div>
</template>
<script>
    import CopyField from '@/components/CopyField';
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
        components: { CopyField },
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

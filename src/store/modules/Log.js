export default {
    state: {
        logs: [],
    },
    mutations: {
        addLog(state, { timestamp, message, ctx, level }) {
            state.logs.push({ timestamp, message, ctx, level });
        },
    },
    getters: {
        logs: state => state.logs,
    },
};

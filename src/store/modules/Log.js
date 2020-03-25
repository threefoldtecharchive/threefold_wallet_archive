export default {
    state: {
        logs: [],
    },
    mutations: {
        addLog(state, log) {
            state.logs.push(log);
        },
    },
    getters: {
        logs: state => state.logs,
    },
};

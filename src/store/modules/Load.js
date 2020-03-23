export default {
    state: {
        loadingTitle: null,
        loadingSubTitle: null,
    },
    mutations: {
        setLoadingMessage(state, { message, additional }) {
            state.loadingTitle = message;
            state.loadingSubTitle = additional;
        },
    },
    actions: {},
    getters: {
        loadingSubTitle: state => state.loadingSubTitle,
        loadingTitle: state => state.loadingTitle,
    },
};

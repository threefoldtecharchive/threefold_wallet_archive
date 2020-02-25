export default {
  state: {
    loadingTitle: 'a title',
    loadingSubTitle: 'with a subtitle',
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

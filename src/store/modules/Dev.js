export default {
  state: {
    devEnabled: false,
    devClicks: 0,
  },
  mutations: {
    addDevClick (state) {
      state.devClicks++;
    },
    resetDevClicks (state) {
      state.devClicks = 0;
    },
  },
  actions: {},
  getters: {
    devClicks: state => state.devClicks,
  },
};

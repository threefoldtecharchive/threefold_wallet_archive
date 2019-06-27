export default({
  state: {
    informationMessage: null
  },
  actions: {
    setInformationMessage (context, message) {
      context.commit('setInformationMessage', message)
    }
  },
  mutations: {
    setInformationMessage: (state, message) => {
      state.informationMessage = message
    }
  },
  getters: {
    informationMessage: (state) => state.informationMessage
  }
})

export default({
  state: {
    informationMessage: null,
    fatalError: null,
    submitDisabled: true
  },
  actions: {
    setInformationMessage (context, message) {
      context.commit('setInformationMessage', message)
    },
    setFatalError (context, message) {
      context.commit('setFatalError', message)
    },
    setSubmitBtnState(context, action){
      context.commit('setSubmitBtnState', action)
    }
  },
  mutations: {
    setInformationMessage: (state, message) => {
      state.informationMessage = message
    },
    setFatalError: (state, message) => {
      state.fatalError = message
    },
    setSubmitBtnState: (state, bool) => {
      state.submitDisabled = bool
    }
  },
  getters: {
    informationMessage: (state) => state.informationMessage,
    fatalError: (state) => state.fatalError,
    submitDisabled: (state) => state.submitDisabled
  }
})

export default({
  state: {
    informationMessage: null,
    fatalError: null,
    floatingActionButton: null
  },
  actions: {
    setInformationMessage (context, message) {
      context.commit('setInformationMessage', message)
    },
    setFatalError (context, message) {
      context.commit('setFatalError', message)
    },
    setFab (context, action) {
      console.log('setting fab to' , action)
      // console.log('was', context.getters.floatingActionButton)
      context.commit('setFab', action)
    }
  },
  mutations: {
    setInformationMessage: (state, message) => {
      state.informationMessage = message
    },
    setFatalError: (state, message) => {
      state.fatalError = message
    },
    setFab: (state, fab) => {
      console.log(fab)
      state.floatingActionButton = true
    }
  },
  getters: {
    informationMessage: (state) => state.informationMessage,
    fatalError: (state) => state.fatalError,
    floatingActionButton: (state) => state.floatingActionButton
  }
})

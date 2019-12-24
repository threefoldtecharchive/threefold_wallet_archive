export default({
  state: {
    informationMessage: null,
    fatalError: null,
    submitDisabled: true,
    isImportingWallet: false
  },
  actions: {
    setInformationMessage (context, message) {
      context.commit('setInformationMessage', message)
    },
    setFatalError (context, message) {
      context.commit('setFatalError', message)
    }
  },
  mutations: {
    setInformationMessage: (state, message) => {
      state.informationMessage = message
    },
    setFatalError: (state, message) => {
      state.fatalError = message
    },
    setImportingWallets: (state, isLoading) => {
      state.isImportingWallet = isLoading
    }
  },
  getters: {
    informationMessage: (state) => state.informationMessage,
    fatalError: (state) => state.fatalError,
    isImportingWallet: (state) => state.isImportingWallet
  }
})

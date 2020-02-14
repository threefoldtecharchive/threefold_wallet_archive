import {fetchTransactions} from "../../services/TransactionService"

export default {
  state: {
    // { "id": "pubKey", "transactions": transactions[]}
    transactions: {},
  },
  computed: {
  },
  actions: {
    addAccount: (context, id) => {
      
    },
    fetchTransactions: async (context , id) => {
      const transactions = await fetchTransactions(id)
    }
  },
  mutations: {
  },
  getters: {
    transactions: (state, id) =>
      state.transactions.find(obj => obj.id == id).transactions
  },
};

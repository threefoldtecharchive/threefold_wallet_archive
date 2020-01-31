import Vue from "vue";
import Vuex from "vuex";
import Wallets from "./modules/Wallets"
import Accounts from "./modules/Accounts"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Wallets,
    Accounts
  }
});

import Vue from "vue";
import Vuex from "vuex";
import Main from "./modules/Main";
import Accounts from "./modules/Accounts";
import Pkid from "./modules/Pkid";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Main,
    Pkid,
    Accounts
  }
});

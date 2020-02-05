import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import sodium from "libsodium-wrappers";

async function startVueApp() {
  Vue.config.productionTip = false;

  await sodium.ready;

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
}

startVueApp();

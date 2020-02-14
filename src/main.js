import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import sodium from 'libsodium-wrappers';
import filters from './utils/filters';
import '@fortawesome/fontawesome-free/css/all.css';
import global from './components/global';

async function startVueApp() {
  Vue.config.productionTip = false;

  await sodium.ready;

  Vue.use(filters);
  Vue.use(global);

  new Vue({
    filters,
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
}

startVueApp();

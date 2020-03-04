import Vue from 'vue'
import App from './App'
import store from './store/'
import router from './router'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import clipboardHack from './lib/clipboardhack'
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  if ((to.name !== 'login' && to.name !== 'error' && to.name !== 'init') && !store.state.accountStore.accounts) {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})

Vue.filter(
  Vue.filter('formatDate', function(value) {
    if (value) {
      return moment(String(value)).format('D MMMM YYYY HH:mm:ss')
    }
  })
)

new Vue({
  store,
  el: '#app',
  created: function () {clipboardHack(); } ,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App'
import store from './store/'
import router from './router'
import './plugins'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if ((to.name !== 'login' && to.name !== 'callback') && !store.state.accountStore.account) {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

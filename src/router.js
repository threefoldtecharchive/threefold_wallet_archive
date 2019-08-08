import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: home,
    meta: {
      title: 'accounts'
    }
  }, {
    path: '/history/:wallet',
    name: 'history',
    component: () => import(/* webpackChunkName: "history-page" */ './views/history')
  }, {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile-page" */ './views/profile')
  }, {
    path: '/investments',
    name: 'investments',
    meta: {
      title: 'investments'
    },
    component: () => import(/* webpackChunkName: "investment-page" */ './views/investments')
  },{
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings-page" */ './views/settings')
  }, {
    path: '/transfer',
    name: 'transfer',
    component: () => import(/* webpackChunkName: "transfer-page" */ './views/transfer')
  }, {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login-page" */ './views/login')
  }, {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error-page" */ './views/errorpage')
  }, {
    path: '*',
    redirect: '404'
  }]
})

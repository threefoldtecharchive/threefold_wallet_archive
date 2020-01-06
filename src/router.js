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
      title: 'Wallets',
      transfer: 'transfer',
      accent: 'accent',
      info: {
        title: 'one hell of a title',
        text: 'this is info'
      }
    }
  }, {
    path: '/addwallet',
    name: 'addwallet',
    meta: {
      accent: 'accent',
      title: 'import/create wallet'
    },
    component: () => import(/* webpackChunkName: "profile-page" */ './views/createWallet')
  }, {
    path: '/details/:wallet',
    name: 'details',
    meta: {
      accent: 'accent',
      transfer: 'transfer',
      info: {
        title: 'Details',
        text: 'this is info'
      }
    },
    component: () => import(/* webpackChunkName: "history-page" */ './views/history')
  }, {
    path: '/profile',
    name: 'profile',
    meta: {
      accent: 'accent'
    },
    component: () => import(/* webpackChunkName: "profile-page" */ './views/profile')
  }, {
    path: '/investments',
    name: 'investments',
    meta: {
      title: 'investments',
      transfer: 'transfer investments',
      accent: 'gold',
      info: {
        title: 'one hell of a title',
        text: 'this is info'
      }
    },
    component: () => import(/* webpackChunkName: "investment-page" */ './views/investments')
  }, {
    path: '/investments/history/:wallet',
    name: 'investments history',
    meta: {
      accent: 'gold',
      transfer: 'transfer investments',
      info: {
        title: 'one hell of a title',
        text: 'this is info'
      }
    },
    component: () => import(/* webpackChunkName: "history-page" */ './views/history')
  }, {
    path: '/investments/transfer',
    name: 'transfer investments',
    meta: {
      accent: 'gold',
      overview: 'investments',
      info: {
        title: 'one hell of a title',
        text: 'this is info'
      }
    },
    component: () => import(/* webpackChunkName: "transfer-page" */ './views/transfer')
  }, {
    path: '/settings',
    name: 'settings',
    meta: {
      accent: 'accent'
    },
    component: () => import(/* webpackChunkName: "settings-page" */ './views/settings')
  }, {
    path: '/transfer',
    name: 'transfer',
    meta: {
      accent: 'accent',
      overview: 'home',
      history: 'details',
      info: {
        title: 'one hell of a title',
        text: 'this is info'
      }
    },
    component: () => import(/* webpackChunkName: "transfer-page" */ './views/transfer')
  }, {
    path: '/login',
    name: 'login',
    meta: {
      accent: 'accent'
    },
    component: () => import(/* webpackChunkName: "login-page" */ './views/login')
  }, {
    path: '/init',
    name: 'init',
    meta: {
      title: 'Initialize',
      accent: 'accent'
    },
    component: () => import(/* webpackChunkName: "init-page" */ './views/init')
  }, {
    path: '/error',
    name: 'error',
    meta: {
      accent: 'accent'
    },
    component: () => import(/* webpackChunkName: "error-page" */ './views/errorpage')
  }, {
    path: '*',
    redirect: '404',
    meta: {
      accent: 'accent'
    }
  }]
})

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import Init from "@/views/Init";
import createWallet from "@/views/createWallet";
import Details from "@/views/Details";
import DevView from "@/views/DevView";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "wallet",
      transfer: "transfer",
      accent: "accent",
      tags: ["showTransferButton"]
    }
  },
  {
    path: "/init",
    name: "init",
    meta: {
      title: "initialize",
      accent: "accent"
    },
    component: Init
  },
  {
    path: "/devview",
    name: "devview",
    meta: {
      title: "devview",
      accent: "accent"
    },
    component: DevView
  },
  {
    path: "/addwallet",
    name: "addwallet",
    meta: {
      accent: "accent",
      title: "import/create wallet"
    },
    component: createWallet
  },
  {
    path: "/details/:account",
    name: "details",
    meta: {
      title: "details",
      accent: "accent"
    },
    component: Details
  }
  // }, {
  //   path: '/addwallet',
  //   name: 'addwallet',
  //   meta: {
  //     accent: 'accent',
  //     title: 'import/create wallet'
  //   },
  //   component: () => import(/* webpackChunkName: "profile-page" */ './views/createWallet')
  // }, {
  //   path: '/details/:wallet',
  //   name: 'details',
  //   meta: {
  //     accent: 'accent',
  //     transfer: 'transfer',
  //     info: {
  //       title: 'Details',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "history-page" */ './views/history')
  // }, {
  //   path: '/walletinfo/:wallet',
  //   name: 'walletinfo',

  //   meta: {
  //     accent: 'accent',
  //     transfer: 'transfer',
  //     info: {
  //       title: 'wallet info',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "history-page" */ './views/walletinfo')
  // }, {
  //   path: '/profile',
  //   name: 'profile',
  //   meta: {
  //     accent: 'accent'
  //   },
  //   component: () => import(/* webpackChunkName: "profile-page" */ './views/profile')
  // }, {
  //   path: '/investments',
  //   name: 'investments',
  //   meta: {
  //     title: 'investments',
  //     transfer: 'transfer investments',
  //     accent: 'gold',
  //     info: {
  //       title: 'one hell of a title',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "investment-page" */ './views/investments')
  // }, {
  //   path: '/investments/history/:wallet',
  //   name: 'investments history',
  //   meta: {
  //     accent: 'gold',
  //     transfer: 'transfer investments',
  //     info: {
  //       title: 'one hell of a title',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "history-page" */ './views/history')
  // }, {
  //   path: '/investments/transfer',
  //   name: 'transfer investments',
  //   meta: {
  //     accent: 'gold',
  //     overview: 'investments',
  //     info: {
  //       title: 'one hell of a title',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "transfer-page" */ './views/transfer')
  // }, {
  //   path: '/settings',
  //   name: 'settings',
  //   meta: {
  //     accent: 'accent'
  //   },
  //   component: () => import(/* webpackChunkName: "settings-page" */ './views/settings')
  // }, {
  //   path: '/transfer',
  //   name: 'transfer',
  //   meta: {
  //     accent: 'accent',
  //     overview: 'home',
  //     history: 'details',
  //     info: {
  //       title: 'one hell of a title',
  //       text: 'this is info'
  //     }
  //   },
  //   component: () => import(/* webpackChunkName: "transfer-page" */ './views/transfer')
  // }, {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     accent: 'accent'
  //   },
  //   component: () => import(/* webpackChunkName: "login-page" */ './views/login')
  // }, {
  //   path: '/Init',
  //   name: 'Init',
  //   meta: {
  //     title: 'Initialize',
  //     accent: 'accent'
  //   },
  //   component: () => import(/* webpackChunkName: "Init-page" */ './views/Init')
  // }, {
  //   path: '/error',
  //   name: 'error',
  //   meta: {
  //     accent: 'accent'
  //   },
  //   component: () => import(/* webpackChunkName: "error-page" */ './views/errorpage')
  // }, {
  //   path: '*',
  //   redirect: '404',
  //   meta: {
  //     accent: 'accent'
  //   }
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!store.getters.initialized && to.name !== "error" && to.name !== "init") {
    next({
      name: "init"
    });
    return;
  }
  next();
});

export default router;

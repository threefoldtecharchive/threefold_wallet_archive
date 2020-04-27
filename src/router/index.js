import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import Init from '@/views/Init';
import Sms from '@/views/Sms';
import createWallet from '@/views/createWallet';
import Details from '@/views/Details';
import Transfer from '@/views/Transfer';
import DevView from '@/views/DevView';
import store from '../store';
import errorScreen from '@/views/errorScreen';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'wallet',
            transfer: 'transfer',
            accent: 'accent',
            tags: ['showTransferButton'],
        },
    },
    {
        path: '/init',
        name: 'init',
        meta: {
            title: 'initialize',
            accent: 'accent',
        },
        component: Init,
    },
    {
        path: '/devview',
        name: 'devview',
        meta: {
            title: 'devview',
            accent: 'accent',
        },
        component: DevView,
    },
    {
        path: '/errorscreen:reason?:fix?',
        name: 'error screen',
        meta: {
            title: 'Error Screen',
            accent: 'accent',
        },
        component: errorScreen,
    },
    {
        path: '/sms/:code/:tel/:address',
        name: 'sms',
        meta: {
            title: 'account activation',
            accent: 'accent',
        },
        component: Sms,
    },
    {
        path: '/addwallet',
        name: 'addwallet',
        meta: {
            accent: 'accent',
            title: 'import wallet',
        },
        component: createWallet,
    },
    {
        path: '/details/:account',
        name: 'details',
        meta: {
            title: 'details',
            transfer: 'transfer',
            accent: 'accent',
        },
        component: Details,
    },
    {
        path: '/transfer/:account?',
        name: 'transfer',
        meta: {
            accent: 'accent',
            overview: 'home',
            history: 'details',
        },
        component: Transfer,
    },
    {
        path: '/walletinfo/:account',
        name: 'wallet info',

        meta: {
            accent: 'accent',
            transfer: 'transfer',
            info: {
                title: 'wallet info',
                text: 'this is info',
            },
        },
        component: () =>
            import(/* webpackChunkName: "wallet-info" */ '../views/WalletInfo'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    window.noCopyPaste = false;

    store.dispatch('disableAccountEventStreams');
    if (
        !store.getters.initialized &&
        to.name !== 'error' &&
        to.name !== 'init'
    ) {
        next({
            name: 'init',
        });
        return;
    }
    next();
});

export default router;

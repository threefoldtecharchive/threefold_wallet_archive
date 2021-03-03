import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import sodium from 'libsodium-wrappers';
import filters from './utils/filters';
import '@fortawesome/fontawesome-free/css/all.css';
import global from './components/global';
import clipboardHack from './utils/clipboardhack';

import './scss/misc.scss';

import config from '../public/config';

import Logger from 'js-logger';
Logger.useDefaults();

const consoleHandler = Logger.createDefaultHandler();
const myHandler = function (messages, context) {
    const [message, ctxUnformated] = messages;

    store.commit('addLog', {
        timestamp: new Date().toUTCString(),
        message,
        ctx: ctxUnformated,
        level: context.level.name,
    });
};

Logger.setHandler(function (messages, context) {
    consoleHandler(messages, context);
    myHandler(messages, context);
});

const initializeStellarCryptoConfig = () => {
    window.stellarServerUrl = config.stellarServerUrl;
    window.stellarNetwork = config.stellarNetwork;
    window.serviceUrl = config.serviceUrl;
    window.feeDestination = config.feeDestination;
    window.feeAmount = config.feeAmount;
    window.currencies = config.currencies;
};

const initializeFlutterInappwebviewPolyfill = () => {
    if (window.flutter_inappwebview) {
        return;
    }
    window.flutter_inappwebview = {
        async callHandler(key, ...args) {
            console.log('flutter_inappwebview.callhandler called', {
                key,
                ...args,
            });
        },
    };
};

async function startVueApp() {
    Vue.config.productionTip = false;

    await sodium.ready;

    Vue.use(filters);
    Vue.use(global);
    initializeFlutterInappwebviewPolyfill();
    initializeStellarCryptoConfig();

    new Vue({
        created: function () {
            var isMobile = /iPhone|iPad|iPod|Android/i.test(
                navigator.userAgent
            );
            if (isMobile) {
                clipboardHack();

                // They isnt always loaded correctly.
                setTimeout(function () {
                    clipboardHack();
                }, 1000);
            }
            Logger.info("I'm a debug message!");
        },
        filters,
        router,
        store,
        vuetify,
        render: h => h(App),
    }).$mount('#app');

    window.flutter_inappwebview.callHandler('VUE_INITIALIZED');
}

startVueApp();

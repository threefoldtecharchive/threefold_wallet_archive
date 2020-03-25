import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import sodium from 'libsodium-wrappers';
import filters from './utils/filters';
import '@fortawesome/fontawesome-free/css/all.css';
import global from './components/global';
import clipboardHack from './utils/clipboardhack';

import config from '../public/config';

const initializeStellarCryptoConfig = () => {
    window.stellarServerUrl = config.stellarServerUrl;
    window.stellarNetwork = config.stellarNetwork;
    window.tftIssuer = config.tftIssuer;
    window.serviceUrl = config.serviceUrl;
};

const initializeFlutterInappwebviewPolyfill = () => {
    if (window.flutter_inappwebview){
        return;
    }
    window.flutter_inappwebview = {
        async callHandler (key, ...args){
            console.log('flutter_inappwebview.callhandler called', {key,...args});
        }
    }
};

async function startVueApp() {
    Vue.config.productionTip = false;

    await sodium.ready;

    Vue.use(filters);
    Vue.use(global);
    initializeFlutterInappwebviewPolyfill()
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

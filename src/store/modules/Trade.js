import config from '@/../public/config';
import Pkid from '@jimber/pkid';
import sodium from 'libsodium-wrappers';
import router from '@/router';

export default {
    state: {
        tradeInfo: null,
    },
    actions: {},
    mutations: {
        setTradeInfo(state, tradeInfo) {
            state.tradeInfo = tradeInfo;
        },
        clearTradeInfo(state) {
            state.tradeInfo = null;
        },
    },
    getters: {
        tradeInfo: state => state.tradeInfo,
    },
};

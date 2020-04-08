import { formatBalance, formatBalanceHumanReadable } from './formatBalance';
import { formatDate, formatDay, formatUnlockTime } from './formatDate';
import { readableAddress } from './readableAddress';

export default {
    install(Vue) {
        Vue.filter('formatBalance', formatBalance);
        Vue.filter('formatBalanceHumanReadable', formatBalanceHumanReadable);
        Vue.filter('formatDate', formatDate);
        Vue.filter('formatDay', formatDay);
        Vue.filter('readableAddress', readableAddress);
        Vue.filter('formatUnlockTime', formatUnlockTime);
    },
};

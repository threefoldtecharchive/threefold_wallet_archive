import { formatBalance, formatBalanceHumanReadable } from './formatBalance';

export default {
  install (Vue) {
    Vue.filter('formatBalance', formatBalance);
    Vue.filter('formatBalanceHumanReadable', formatBalanceHumanReadable);
  },
};

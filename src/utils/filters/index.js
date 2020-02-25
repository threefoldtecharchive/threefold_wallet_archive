import { formatBalance, formatBalanceHumanReadable } from './formatBalance';
import { formatDate } from './formatDate';

export default {
  install (Vue) {
    Vue.filter('formatBalance', formatBalance);
    Vue.filter('formatBalanceHumanReadable', formatBalanceHumanReadable);
    Vue.filter('formatDate', formatDate);
  },
};

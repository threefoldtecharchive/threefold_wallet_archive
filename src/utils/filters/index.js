import { formatBalance, formatBalanceHumanReadable } from './formatBalance';
import { formatDate, formatDay } from './formatDate';

export default {
  install (Vue) {
    Vue.filter('formatBalance', formatBalance);
    Vue.filter('formatBalanceHumanReadable', formatBalanceHumanReadable);
    Vue.filter('formatDate', formatDate);
    Vue.filter('formatDay', formatDay);
  },
};

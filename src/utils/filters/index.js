import { formatBalance } from './formatBalance';

export default {
  install(Vue) {
    Vue.filter('formatBalance', formatBalance);
  },
};

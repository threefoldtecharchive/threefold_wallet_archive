import { mapGetters, mapActions } from 'vuex';
import router from '../../router';

export default {
  name: 'DevView',
  components: {},
  props: [],
  data () {
    return {};
  },
  computed: {
    ...mapGetters([
      'accounts',
      'pkidApp',
      'pkidImported',
      'appSeedPhrase',
      'threeBotName',
    ]),
  },
  mounted () {},
  methods: {
    ...mapActions(['generateAppAccount']),
    createWallet () {
      this.generateAppAccount(
        `dev wallet #${Math.random()
          .toString(36)
          .substr(2, 5)}`
      );
    },
  },
};

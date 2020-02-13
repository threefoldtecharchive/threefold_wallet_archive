import { mapActions } from 'vuex';
import { decodeBase64 } from 'tweetnacl-util';
import router from '../../router';

export default {
  name: 'Init',
  components: {},
  props: [],
  data() {
    return {};
  },
  computed: {},
  mounted() {
    window.vueInstance = this;
    this.startWallet(
      'jonaswijne.3bot',
      'SsoeBx7TRjjc70PXmr913rCVtNAkDsJ7KCvZjglXcIc=',
      'null',
      'null'
    );
  },
  methods: {
    ...mapActions(['initialize']),
    async startWallet(doubleName, seed, importedWallets, appWallets) {
      seed = new Uint8Array(decodeBase64(seed));
      try {
        this.initialize({
          doubleName,
          seed,
          importedWallets,
          appWallets,
        });
        router.push({ name: 'home' });
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};

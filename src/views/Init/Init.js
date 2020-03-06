import { mapActions } from 'vuex';
import { decodeBase64 } from 'tweetnacl-util';
import router from '../../router';
import { migrateToPkid } from '../../services/PkidMigrationService';

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
    window.vueInstance.startWallet(
      'jonaswijne.3bot',
      'SsoeBx7TRjjc70PXmr913rCVtNAkDsJ7KCvZjglXcIa=',
      null,
      null
    );
  },
  methods: {
    ...mapActions(['initialize']),
    async startWallet(doubleName, seed, importedWallets, appWallets) {
      seed = new Uint8Array(decodeBase64(seed));
      importedWallets = JSON.parse(importedWallets);
      appWallets = JSON.parse(appWallets);
      try {
        await migrateToPkid({ seed, importedWallets, appWallets });
      } catch (error) {
        // add fatal error
        return;
      }
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

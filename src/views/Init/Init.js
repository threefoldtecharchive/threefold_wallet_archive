import { mapActions } from 'vuex';
import { decodeBase64 } from 'tweetnacl-util';
import router from '../../router';
import { migrateToPkid } from '../../services/PkidMigrationService';

export default {
  name: 'Init',
  components: {},
  props: [],
  data () {
    return {};
  },
  computed: {},
  mounted () {
    window.vueInstance = this;
    this.startWallet(
      'jonaswijne.3bot',
      'SsoeBx7TRjjc70PXmr913rCVtNAkDsJ7KCvZjglXcIc=',
      '[{"walletName":"extra import","doubleName":"jonaswijne.3bot","seed":[135,223,189,140,248,237,200,103,228,253,159,141,73,202,63,199,150,93,57,239,130,232,241,163,109,42,122,48,111,94,60,113]}]',
      '[{"walletName":"extra app","doubleName":"jonaswijne.3bot"}]'
    );
  },
  methods: {
    ...mapActions(['initialize']),
    async startWallet (doubleName, seed, importedWallets, appWallets) {
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

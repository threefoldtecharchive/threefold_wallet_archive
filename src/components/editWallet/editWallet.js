import {
  mapGetters,
  mapActions
} from 'vuex'
import { watch } from 'fs'

export default {
  name: 'edit-wallet',
  components: {},
  props: {
    'show': {
      type: Boolean
    }
  },
  data() {
    return {
      oldWalletName: null,
      newWalletName: null,
      walletNameErrors: [],
    }
  },
  computed: {
    ...mapGetters([
      'wallets'
    ]),
    selectedWallet() {
      let selectedWallet = this.wallets.find(x => x.name === this.$route.params.wallet)
      return selectedWallet
    }

  },
  mounted() {
      
  },
  methods: {
    ...mapActions([
      'importWallet'
    ]),
    addWallet() {
      if (!this.newWalletName) {
        this.walletNameErrors.push("Please enter a name.")
        return
      }

      //todo rename wallet function
    }
  },
  watch: {
    show: function () {
      if(this.show) {
        console.log(this.selectedWallet)
        this.oldWalletName = this.selectedWallet.name
      }
    }
  }
}
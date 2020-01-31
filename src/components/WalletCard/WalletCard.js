import AmountIndicator from "../AmountIndicator";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wallet-card",
  components: { AmountIndicator },
  props: {
    wallet: {
      type: Object
    },
    clickable: {
      type: Boolean
    },
    selected: {
      type: Boolean
    },
    displayAttributes: {
      type: Boolean,
      default: true
    },
    displayAmount: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      amount: "---",
      authenticated: true
    };
  },
  computed: {
    ...mapGetters(["accounts"]),
    totalAmount() {
      return Number(this.wallet.totalAmount.replace(/,/g, "")).toFixed(2);
    },
    getHumanWalletAddress() {
      // return `${this.wallet.name}@${this.account.account_name}`
      return `${this.wallet.name.replace(/\s/g, "")}@${
        this.wallet.holder.account_name.split(":")[1]
      }`;
    }
    // image () {
    //   let currency = this.wallet.currency.toLowerCase()
    //   if (currency == 'gram') return 'gram-image'
    //   if (currency == 'gft') return 'gft-image'
    //   if (currency == 'tft') return 'tft-image'
    // }
  },
  mounted() {},
  methods: {
    ...mapActions(["setInformationMessage"]),
    copyAddress() {
      this.$root.$emit("copy", {
        title: "Copy wallet address to clipboard",
        toCopy: this.wallet.address,
        callback: () => {
          this.setInformationMessage(
            `Address has been copied to clipboard (${this.wallet.address.substring(
              0,
              8
            )}...).`
          );
        }
      });
    },
    async removeWallet() {
      await this.$store.dispatch("removePkidWallet", this.wallet);
    },
    clicked() {
      if (this.clickable && this.authenticated)
        this.$emit("click", this.wallet);
    }
  }
};

import Balance from "../Balance";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "account-card",
  components: { Balance },
  props: {
    account: {
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
      amount: "---"
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "threeBotName"
    ]),
    getHumanWalletAddress() {
      return `${this.account.name.replace(/\s/g, "")}@${this.threeBotName}`;
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions(["setInformationMessage"]),
    copyAddress() {
      this.$root.$emit("copy", {
        title: "Copy wallet address to clipboard",
        toCopy: this.account.id,
        callback: () => {
          this.setInformationMessage(
            `Address has been copied to clipboard (${this.account.id.substring(
              0,
              8
            )}...).`
          );
        }
      });
    },
    clicked() {
      if (this.clickable) {
        this.$emit("click", this.account);
      }
    }
  }
};

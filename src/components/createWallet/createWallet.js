import {
  mapGetters,
  mapActions
} from 'vuex'
import cryptoService from '../../services/cryptoService'

export default {
  name: 'create-wallet',
  components: {},
  props: {
    'show': {
      type: Boolean
    }
  },
  data() {
    return {
      tabs: ['import', 'create'],
      currentTab: 'import',
      walletName: null,
      words: null,
      walletNameErrors: [],
      wordsErrors: [],
    }
  },
  computed: {
    ...mapGetters([
      'doubleName'
    ])
  },
  mounted() {

  },
  methods: {
    ...mapActions([
      'importWallet',
      'createWallet'
    ]),
    addCreateWallet() {
      console.log("Creating wallet... ")
      console.log('Name: ', this.walletName)
      // ID: 0 HARDCODED FOR NOW!
      this.createWallet({ chain: 'tft', walletName: this.walletName, id: '0' })

      var postMsg = {
        type: "ADD_APP_WALLET",
        walletName: this.walletName,
        doubleName: this.doubleName
      }

      Print.postMessage(JSON.stringify(postMsg));

      this.$emit('ctaClicked')
      this.walletName = null
      this.words = null
      this.walletNameErrors = []
      this.wordsErrors = []
    },
    addImportWallet() {
      if(!this.walletName) {
        this.walletNameErrors.push("Please enter a name.")
        return
      }

      if(!this.words) {
        this.wordsErrors.push("Please enter your words / seed phrase.")
        return
      }

      this.words = this.words.replace(/[^a-zA-Z ]/g, '').toLowerCase().trim().replace(/\s\s+/g, ' ')
      let wordCount = this.words.split(" ").length

      if(wordCount !== 24) {
        this.wordsErrors.push("Please make sure you've entered 24 words. [" + wordCount + "/24]")
        return
      }

      if(this.walletName && wordCount === 24) {
        let generatedSeed = cryptoService.generateSeedFromMnemonic(this.words);


        // let seed = new Uint8Array([172, 71, 122, 113, 182, 210, 235, 96, 117, 42, 129, 137, 68, 81, 61, 29, 61, 218, 212, 220, 221, 146, 109, 160, 95, 255, 86, 234, 249, 72, 157, 183]);
        // console.log("Original seed: ", {seed})

        // let MnemonicSeed = await cryptoService.generateMnemonicFromSeed(seed);
        // console.log('Mnemonic Seed: ', {MnemonicSeed})

        // let backToSeed = await cryptoService.generateSeedFromMnemonic(MnemonicSeed);

        // const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // console.log('Should be original: ', fromHexString(backToSeed))

        const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        let mySeed = convertHexstringToEntropy(generatedSeed);

        let obj = {doubleName: this.doubleName, walletName: this.walletName, seed: mySeed}
        this.importWallet(obj)

        var postMsg = {
          type: "ADD_IMPORT_WALLET",
          walletName: this.walletName,
          doubleName: this.doubleName,
          seed: Array.from(mySeed)
        }

        Print.postMessage(JSON.stringify(postMsg));
      }

      
      this.$emit('ctaClicked')
      this.walletName = null
      this.words = null
      this.walletNameErrors = []
      this.wordsErrors = []
    }
  }
}
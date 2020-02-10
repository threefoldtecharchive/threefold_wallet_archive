import {
  mapGetters,
  mapActions
} from 'vuex'
import cryptoService from '../../services/cryptoService'

export default {
  name: 'create-wallet',
  components: {},
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      tabs: ['import', 'create'],
      currentTab: 'import',
      walletName: null,
      words: null,
      walletNameErrors: [],
      wordsErrors: []
    }
  },
  computed: {
    ...mapGetters([
      'accounts'
    ])
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      'importWallet',
      'generateAppAccount'
    ]),
    //@TODO Account service file?
    isValidWalletName (walletName) {
      if (!walletName) {
        return {
          success: false,
          message: "Please enter a name."
        }
      }
      if (walletName.length > 15) {
        return {
          success: false,
          message: "The length of the name should not exceed 15 characters."
        }
      }
      if (this.accounts.find(x => x.name.toLowerCase() == this.walletName.toLowerCase())){
        return {
          success: false,
          message: "There is already a wallet with this name"
        }
      }
      return {
        success: true,
        message: "The name is successfully validated"
      }
    },
    addCreateWallet () {
      this.walletNameErrors = []
      this.wordsErrors = []
      this.walletName = this.walletName.trim()

      const walletValidation = this.isValidWalletName(this.walletName)
      if(!walletValidation.success){
        this.walletNameErrors.push(walletValidation.message)
        return
      }
      this.generateAppAccount(this.walletName)
      this.$router.push({ name: 'home' })
      this.walletName = null
      this.words = null
    },
    // async addImportWallet () {
    //   this.walletName = this.walletName.trim()

    //   if(!walletValidation.success){
    //     this.walletNameErrors.push(walletValidation.message)
    //     return
    //   }

    //   this.words = this.words.replace(/[^a-zA-Z ]/g, '').toLowerCase().trim().replace(/\s\s+/g, ' ')
    //   const wordCount = this.words.split(' ').length

    //   if (wordCount !== 24) {
    //     this.wordsErrors.push('Please make sure you\'ve entered 24 words. [' + wordCount + '/24]')
    //     return
    //   }

    //   if (this.walletName && wordCount === 24) {
    //     var that = this
    //     try {
    //       const generatedSeed = cryptoService.generateSeedFromMnemonic(this.words)
    //       // let seed = new Uint8Array([172, 71, 122, 113, 182, 210, 235, 96, 117, 42, 129, 137, 68, 81, 61, 29, 61, 218, 212, 220, 221, 146, 109, 160, 95, 255, 86, 234, 249, 72, 157, 183]);
    //       // let MnemonicSeed = await cryptoService.generateMnemonicFromSeed(seed);
    //       // let backToSeed = await cryptoService.generateSeedFromMnemonic(MnemonicSeed);
    //       // const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    //       const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

    //       const mySeed = convertHexstringToEntropy(generatedSeed)

    //       const foundWallet = importedSeedFound(mySeed)

    //       if (foundWallet) {
    //         this.wordsErrors.push(`This seed is already imported under the name "${foundWallet.name}"`)
    //         return
    //       }

    //       const obj = { doubleName: this.doubleName, walletName: this.walletName, seed: mySeed }

    //       await this.importWallet(obj)

    //       this.$router.push({ name: 'home' })
    //     } catch (e) {
    //       console.log(e.message)
    //       that.wordsErrors.push('Something went wrong: ' + e.message)
    //       return
    //     }
    //   }

      // this.walletName = null
      // this.words = null
      // this.walletNameErrors = []
      // this.wordsErrors = []
    // }
  }
}

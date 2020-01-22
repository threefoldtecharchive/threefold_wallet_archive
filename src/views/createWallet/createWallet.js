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
      'doubleName',
      'wallets'
    ])
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      'importWallet',
      'createWallet'
    ]),
    walletNameFound () {
      return this.wallets.find(x => x.name.toLowerCase() == this.walletName.toLowerCase())
    },
    addCreateWallet () {
      this.walletNameErrors = []
      this.wordsErrors = []
      this.walletName = this.walletName.trim()

      if (!this.walletNameFound()) {
        // ID: 0 HARDCODED FOR NOW!
        this.createWallet({ chain: 'tft', walletName: this.walletName, id: '0' })

        var postMsg = {
          walletName: this.walletName,
          doubleName: this.doubleName
        }

        postMsg = JSON.stringify(postMsg)

        // Print.postMessage(JSON.stringify(postMsg))
        var self = this
        window.flutter_inappwebview.callHandler('ADD_APP_WALLET', postMsg).then(function (result) {
          console.log('flutter result', result)
          if (result) {
            self.$router.push({ name: 'home' })
          } else {
            self.walletNameErrors.push('The wallet name was not valid')
          }
        })
        // let result = true
        // if (result) {
        //   this.$router.push({ name: 'home' })
        // } else {
        //   this.walletNameErrors.push('The wallet name was not valid')
        // }
        this.$emit('ctaClicked')
        this.walletName = null
        this.words = null
      } else {
        this.walletNameErrors.push('There is already a wallet with this name')
      }
    },
    addImportWallet () {
      this.walletName = this.walletName.trim()
      if (!this.walletName) {
        this.walletNameErrors.push('Please enter a name.')
        return
      }
      if (this.walletNameFound()) {
        this.walletNameErrors.push('There is already a wallet with this name')
        return
      }

      if (!this.words) {
        this.wordsErrors.push('Please enter your words / seed phrase.')
        return
      }

      this.words = this.words.replace(/[^a-zA-Z ]/g, '').toLowerCase().trim().replace(/\s\s+/g, ' ')
      const wordCount = this.words.split(' ').length

      if (wordCount !== 24) {
        this.wordsErrors.push("Please make sure you've entered 24 words. [" + wordCount + '/24]')
        return
      }

      if (this.walletName && wordCount === 24) {
        var that = this
        try{
          const generatedSeed = cryptoService.generateSeedFromMnemonic(this.words)
          // let seed = new Uint8Array([172, 71, 122, 113, 182, 210, 235, 96, 117, 42, 129, 137, 68, 81, 61, 29, 61, 218, 212, 220, 221, 146, 109, 160, 95, 255, 86, 234, 249, 72, 157, 183]);
          // let MnemonicSeed = await cryptoService.generateMnemonicFromSeed(seed);
          // let backToSeed = await cryptoService.generateSeedFromMnemonic(MnemonicSeed);
          // const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
          const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

          const mySeed = convertHexstringToEntropy(generatedSeed)

          const obj = { doubleName: this.doubleName, walletName: this.walletName, seed: mySeed }

          let continueImport = this.importWallet(obj)

          if (continueImport) {
            var postMsg = {
              walletName: this.walletName,
              doubleName: this.doubleName,
              seed: Array.from(mySeed)
            }

            postMsg = JSON.stringify(postMsg)
            // Print.postMessage(JSON.stringify(postMsg))
            console.log('before flutter call', postMsg)
            var self = this
            window.flutter_inappwebview.callHandler('ADD_IMPORT_WALLET', postMsg).then(function (result) {
              console.log('flutter result', result)
              self.$router.push({ name: 'home' })
            })
          }
        } catch (e) {
          console.log(e.message)
          that.wordsErrors.push("Something went wrong: " + e.message)
          return
        }
      }

      this.$emit('ctaClicked')
      this.walletName = null
      this.words = null
      this.walletNameErrors = []
      this.wordsErrors = []
    }
  }
}

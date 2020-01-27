import {
  mapGetters,
  mapActions
} from 'vuex'
import store from '../../store'
import cryptoService from '../../services/cryptoService'
import uuidv4 from 'uuid/v4'

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

        this.$router.push({ name: 'home' })

        this.$emit('ctaClicked')
        this.walletName = null
        this.words = null
      } else {
        this.walletNameErrors.push('There is already a wallet with this name')
      }
    },
    async addImportWallet () {
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
        this.wordsErrors.push('Please make sure you\'ve entered 24 words. [' + wordCount + '/24]')
        return
      }

      if (this.walletName && wordCount === 24) {
        var that = this
        try {
          const generatedSeed = cryptoService.generateSeedFromMnemonic(this.words)
          // let seed = new Uint8Array([172, 71, 122, 113, 182, 210, 235, 96, 117, 42, 129, 137, 68, 81, 61, 29, 61, 218, 212, 220, 221, 146, 109, 160, 95, 255, 86, 234, 249, 72, 157, 183]);
          // let MnemonicSeed = await cryptoService.generateMnemonicFromSeed(seed);
          // let backToSeed = await cryptoService.generateSeedFromMnemonic(MnemonicSeed);
          // const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
          const convertHexstringToEntropy = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

          const mySeed = convertHexstringToEntropy(generatedSeed)

          const obj = { doubleName: this.doubleName, walletName: this.walletName, seed: mySeed }

          let continueImport = await this.importWallet(obj)

          if (continueImport) {
            var postMsg = {
              referenceUuid: uuidv4(),
              walletName: this.walletName,
              doubleName: this.doubleName,
              seed: Array.from(mySeed)
            }
            console.log(postMsg)
            // Print.postMessage(JSON.stringify(postMsg))
            console.log('before flutter call', postMsg)
            var self = this

            this.$router.push({ name: 'home' })
          }
        } catch (e) {
          console.log(e.message)
          that.wordsErrors.push('Something went wrong: ' + e.message)
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

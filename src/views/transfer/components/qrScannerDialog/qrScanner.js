import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
export default {
  name: 'qr-scanner',
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function
    },
    selectedTab: {
      type: Number
    },
    formObject: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    onDecode (code) {
      console.log(code)
      code = code.replace('tft:', 'tft://')
      this.formObject.to.address = this.getQueryVar(code, 'HOST')
      this.formObject.amount = this.getQueryVar(code, 'amount')
      this.formObject.message = this.getQueryVar(code, 'message')
      this.formObject.sender = this.getQueryVar(code, 'sender')
      if (this.formObject.to && this.formObject.to.address && this.formObject.amount) {
        this.transactionInfoDialog = true
      } else {
        // SHOW ERROR

      }
      this.closeDialog()
    },
    getQueryVar (url, varName) {
      var val
      url = new URL(url)
      if (varName === 'HOST') {
        val = url.pathname.replace('//', '')
      } else {
        val = url.searchParams.get(varName)
      }
      return val
    }
  }
}

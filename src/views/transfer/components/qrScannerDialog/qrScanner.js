import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
export default {
  name: 'qr-scanner',
  components: {
    QrcodeStream, 
    QrcodeDropZone, 
    QrcodeCapture, 
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
    onDecode: {
      type: Function
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {

  }
}

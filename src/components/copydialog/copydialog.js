import copy from 'clipboard-copy'
export default {
  name: 'copydialog',
  components: {},
  props: [],
  data () {
    return {
      dialog: false,
      data: {
        title: 'Copy to clipboard',
        toCopy: 'abc123'
      }
    }
  },
  computed: {

  },
  mounted () {
    this.$root.$on('copy', (data) => {
      // this.data = data
      // if (navigator.userAgent.indexOf('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Mobile Safari/537.36') !== -1) {
      //   this.dialog = true
      //   this.$nextTick(() => this.$refs.copyField.focus())
      // } else {
      //   this.copyAndCallback()
      // }
      
      window.flutter_inappwebview.callHandler('COPY', data.toCopy).then(function (result) {
        data.callback()
      })
    })
  },
  methods: {
    copyAndCallback () {
      copy(this.data.toCopy)
      if (this.data.callback) {
        this.data.callback()
      }
      this.dialog = false
    }
  }
}

export default {
  name: 'errorpage',
  components: {},
  props: [],
  data () {
    return {
      errorMsg: ''
    }
  },
  computed: {

  },
  mounted () {

    var url = new URL(window.location.href)
    const error = url.searchParams.get('msg')
    if (error === 'CancelledByUser') {
        this.errorMsg = `Your login attempt was cancelled.`
    } else if( error === `Could not decrypt message.`) {
      this.errorMsg = `Could not decrypt message.`
    }
  },
  methods: {

  }
}

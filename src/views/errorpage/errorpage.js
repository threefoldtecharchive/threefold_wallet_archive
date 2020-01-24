const mapError = error => {
  switch (error) {
    case 'CancelledByUser':
      return 'Your login attempt was cancelled.'
    case 'Could not decrypt message.':
      return 'Something went wrong with decrypting'
    default:
      return error
  }
}

export default {
  name: 'errorpage',
  components: {},
  props: [],
  data () {
    return {
      errorMsg: ''
    }
  },
  computed: {},
  mounted () {
    var url = new URL(window.location.href)
    const error = url.searchParams.get('msg')
    this.errorMsg = mapError(error)
  },
  methods: {}
}

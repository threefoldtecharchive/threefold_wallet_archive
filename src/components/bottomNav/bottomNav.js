export default {
  name: 'bottom-nav',
  components: {},
  props: [],
  data () {
    return {
      bottomnav: 0,
      submitDisabled: true,
      showTransferButtonOn: []
    }
  },
  computed: {
    showTransferButton () {
      const currentPage = this.$route.name
      const allowedPages = ["home","details"]
      let isAllowed = false
      allowedPages.forEach( function (page) {
        if(currentPage === page){
          isAllowed =  true
        }
      })
      return isAllowed
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  methods: {
    handleCta () {
      let wallet = this.$route.params.wallet
      this.$router.push({ name: this.$route.meta.transfer, params: {wallet} })
    }
  }
}

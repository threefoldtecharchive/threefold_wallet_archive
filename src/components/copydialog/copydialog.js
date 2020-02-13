import copy from 'clipboard-copy';
export default {
  name: 'copydialog',
  components: {},
  props: [],
  data() {
    return {
      dialog: false,
      data: {
        title: 'Copy to clipboard',
        toCopy: 'abc123',
      },
    };
  },
  computed: {},
  mounted() {
    this.$root.$on('copy', data => {
      window.flutter_inappwebview
        .callHandler('COPY', data.toCopy)
        .then(function(result) {
          data.callback();
        });
    });
  },
  methods: {
    copyAndCallback() {
      copy(this.data.toCopy);
      if (this.data.callback) {
        this.data.callback();
      }
      this.dialog = false;
    },
  },
};

import { mapGetters, mapMutations } from 'vuex';

export default {
    components: {},
    name: 'Toolbar',
    props: [],
    data() {
        return {
            isScrolling: false,
        };
    },
    computed: {
        ...mapGetters(['syncing', 'accounts', 'devClicks']),
        showBack() {
            const { name } = this.$route;
            return (
                name !== 'home' &&
                name !== 'login' &&
                name !== 'init' &&
                name !== 'error screen' &&
                name !== 'sms'
            );
        },
    },
    mounted() {},
    methods: {
        ...mapMutations(['addDevClick']),
        onScroll() {
            this.isScrolling =
                (window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    0) > 50;
        },
        seeAdd() {
            this.$router.push({
                name: 'addwallet',
            });
        },
        seeWalletInfo() {
            this.$router.push({
                name: 'wallet info',
                params: {
                    account: this.$route.params.account,
                },
            });
        },
        restartWallet() {
            location.replace('/init');
        },
    },
};

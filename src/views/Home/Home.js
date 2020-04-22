import { mapActions, mapGetters } from 'vuex';
import AccountCard from '../../components/AccountCard';
import draggable from 'vuedraggable';
import store from '../../store';
import SkeletonAccountCard from '../../components/SkeletonAccountCard';

export default {
    name: 'Home',
    components: { AccountCard, draggable, SkeletonAccountCard },
    props: [],
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            'isLoadingWallets',
            'isAppLoading',
            'accountThombstones',
        ]),
        actualAccountThombstones() {
            return this.accountThombstones.filter(
                name => !this.accounts.find(a => name === a.name)
            );
        },
        accounts: {
            get() {
                const sortedAccounts = [...store.getters.accounts];
                sortedAccounts.sort(
                    (account, otherAccount) =>
                        account.position - otherAccount.position
                );
                return sortedAccounts;
            },
            set(value) {
                value.map((account, index) => {
                    account.position = index;
                });
                store.commit('setAccounts', value);
                store.dispatch('saveToPkid');
            },
        },
    },
    mounted() {},
    methods: {
        ...mapActions(['syncAccounts']),
        seeDetails: account => {
            this.$router.push({
                name: 'details',
                params: {
                    account: account.id,
                },
            });
        },
        disableCopy(){
            window.noCopyPaste = true
        },
        enableCopy(){
            window.noCopyPaste = false
        }
    },
};

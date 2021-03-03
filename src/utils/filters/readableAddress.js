import store from '@/store';

export const readableAddress = value => {
    if (!value) {
        return;
    }
    const { accounts, threeBotName } = store.getters;
    const account = accounts.find(a => a.id === value);

    if (!account) {
        return value;
    }

    return `${account.name}@${threeBotName}`;
};

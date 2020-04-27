import moment from 'moment';

export const formatDay = value => {
    if (!value) {
        return '';
    }
    const date = moment(String(value));

    if (date.year())
        return String(moment(String(value)).format('DD MMMM YYYY'));
};

export const formatDate = value => {
    if (!value) {
        return;
    }
    return String(moment(String(value)).format('HH:mm:ss | DD MMMM YYYY'));
};

export const formatUnlockTime = value => {
    if (!value) {
        return;
    }
    return moment.unix(value).format('DD MMMM YYYY hh:mm:ss');
}
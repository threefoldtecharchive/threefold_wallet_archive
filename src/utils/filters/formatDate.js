import moment from 'moment';

export const formatDate = value => {
  if (value) {
    return String(moment(String(value)).format('DD MMMM YYYY hh:mm:ss'));
  }
};

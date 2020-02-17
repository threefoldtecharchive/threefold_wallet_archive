const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

export const formatBalance = value => {
  if (!value) {
    return;
  }
  const number = Math.round(value / 10) / 1000;

  // what tier? (determines SI symbol)
  const tier = (Math.log10(number) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) {
    return number.toFixed(3);
  }

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(3) + suffix;
};

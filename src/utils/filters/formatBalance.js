import { round } from '@jimber/stellar-crypto/dist/tfchain/org.transcrypt.__runtime__';

export const formatBalance = value => {
  if (value) {
    return round(value / 10000, 3).toFixed(3);
  }
};

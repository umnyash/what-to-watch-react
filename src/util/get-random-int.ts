import { normalizeIntRange } from './normalize-int-range';

export const getRandomInt = (from: number, to: number) => {
  const [min, max] = normalizeIntRange(from, to);

  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

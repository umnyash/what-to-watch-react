import { getRandomInt } from './get-random-int';

export const shuffle = <T>(array: Array<T>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

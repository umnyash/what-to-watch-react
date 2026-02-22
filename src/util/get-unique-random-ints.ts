import { normalizeIntRange } from './normalize-int-range';
import { getRandomInt } from './get-random-int';
import { shuffle } from './shuffle';

export const getUniqueRandomInts = (range: { from: number; to: number }, count: number) => {
  const [min, max] = normalizeIntRange(range.from, range.to);
  const rangeLength = max - min + 1;

  if (rangeLength < count) {
    throw new Error(
      `The range from ${range.from} to ${range.to} contains only ${rangeLength} integers, which is less than the ${count} requested.`
    );
  }

  if (count > rangeLength / 2) {
    const shuffledInts = shuffle(Array.from({ length: rangeLength }, (_item, index) => index + min));
    return shuffledInts.slice(0, count);
  } else {
    const set: Set<number> = new Set();

    while (set.size < count) {
      set.add(getRandomInt(min, max));
    }

    return Array.from(set);
  }
};

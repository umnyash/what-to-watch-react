import { normalizeIntRange } from './normalize-int-range';
import { getRandomInt } from './get-random-int';

export const getUniqueRandomInts = (range: { from: number; to: number }, count: number) => {
  const [min, max] = normalizeIntRange(range.from, range.to);
  const rangeLength = max - min + 1;

  if (rangeLength < count) {
    throw new Error(
      `The range from ${range.from} to ${range.to} contains only ${rangeLength} integers, which is less than the ${count} requested.`
    );
  }

  const set: Set<number> = new Set();

  while (set.size < count) {
    set.add(getRandomInt(min, max));
  }

  return Array.from(set);
};

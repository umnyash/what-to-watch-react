export const normalizeIntRange = (from: number, to: number) => {
  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

  if (min > max) {
    throw new Error(`There are no integers in the provided range from ${from} to ${to}.`);
  }

  return [min, max];
};

export const getRandomInt = (from: number, to: number) => {
  const [min, max] = normalizeIntRange(from, to);

  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

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

export const getUniqueRandomArrayItems = <T>(array: Array<T>, count: number) =>
  getUniqueRandomInts({ from: 0, to: array.length - 1 }, count).map((int) => array[int]);

export const removeArrayItem = <T>(array: Array<T>, removedItem: T | Partial<T>) => {
  let removedItemIndex: number;

  if (typeof removedItem !== 'object' || removedItem === null) {
    removedItemIndex = array.findIndex((item) => item === removedItem);
  } else {
    const removedItemKeys = Object.keys(removedItem) as Array<keyof T>;

    removedItemIndex = array.findIndex((item) =>
      removedItemKeys.every((key) => item[key] === removedItem[key])
    );
  }

  if (removedItemIndex === -1) {
    throw new Error('Item not found in array.');
  }

  array.splice(removedItemIndex, 1);
};

export const groupBy = <K extends PropertyKey, T>(items: Iterable<T>, getKey: (item: T) => K) =>
  Array.from(items).reduce(
    (result: Partial<Record<K, T[]>>, item) => {
      const key = getKey(item);

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);

      return result;
    },
    {}
  );

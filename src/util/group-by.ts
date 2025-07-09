export const groupBy = <K extends PropertyKey, T>(items: Iterable<T>, getKey: (item: T) => K) =>
  Array.from(items).reduce(
    (result: Partial<Record<K, T[]>>, item) => {
      const key = getKey(item);
      result[key] ??= [];

      result[key].push(item);

      return result;
    },
    {}
  );

export const omit = <T extends object, K extends keyof T>(obj: T, ...keysToRemove: K[]): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key as K))
  ) as Omit<T, K>;

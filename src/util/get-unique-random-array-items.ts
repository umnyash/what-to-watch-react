import { getUniqueRandomInts } from './get-unique-random-ints';

export const getUniqueRandomArrayItems = <T>(array: Array<T>, count: number) =>
  getUniqueRandomInts({ from: 0, to: array.length - 1 }, count).map((int) => array[int]);

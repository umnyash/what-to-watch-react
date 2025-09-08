import { getUniqueRandomInts } from './get-unique-random-ints';

describe('Function: getUniqueRandomInts', () => {
  const FROM = 1;
  const TO = 12;
  const RANGE_LENGTH = 12; // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  const REQUESTED_INTS_SOME_CORRECT_COUNT = 9;

  const result = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);

  it('should return an array with 9 elements', () => {
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(REQUESTED_INTS_SOME_CORRECT_COUNT);
  });

  it('should return an array of unique numbers with 9 elements', () => {
    const uniqueNubmbersCount = new Set(result).size;

    expect(uniqueNubmbersCount).toBe(REQUESTED_INTS_SOME_CORRECT_COUNT);
  });

  it('should return arrays with different numbers when called multiple times, but that\'s not certain', () => {
    const result1 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);
    const result2 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);
    const result3 = getUniqueRandomInts({ from: FROM, to: TO }, REQUESTED_INTS_SOME_CORRECT_COUNT);

    expect(result1).not.toEqual(result2);
    expect(result1).not.toEqual(result3);
    expect(result2).not.toEqual(result3);
  });

  it('should throw an error if the range contains fewer integers than requested', () => {
    const requestedIntsIncorrectCount = RANGE_LENGTH + 1;

    expect(() => getUniqueRandomInts({ from: FROM, to: TO }, requestedIntsIncorrectCount)).toThrow();
  });
});

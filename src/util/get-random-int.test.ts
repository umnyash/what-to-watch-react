import { getRandomInt } from './get-random-int';

describe('Function: getRandomInt', () => {
  const FROM = -5;
  const TO = 5;
  const RANGE_LENGTH = 11; // -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5
  const randomNumbers = Array.from({ length: 100 }, () => getRandomInt(FROM, TO));

  it('should return integers', () => {
    const isAllNumbersIntegers = randomNumbers.every((number) => Number.isInteger(number));

    expect(isAllNumbersIntegers).toBe(true);
  });

  it('should return numbers within a range', () => {
    const min = Math.min(FROM, TO);
    const max = Math.max(FROM, TO);

    const isAllNumbersWithinRange = randomNumbers.every((number) => number >= min && number <= max);

    expect(isAllNumbersWithinRange).toBe(true);
  });

  it('should return every possible number at least once, when called multiple times and in a small range', () => {
    const uniqueNubmbersCount = new Set(randomNumbers).size;

    expect(uniqueNubmbersCount).toBe(RANGE_LENGTH);
  });
});

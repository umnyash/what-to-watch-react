import { getUniqueRandomArrayItems } from './get-unique-random-array-items';

vi.mock('./get-unique-random-ints', () => ({
  getUniqueRandomInts: vi.fn(() => [3, 1])
}));

describe('Function: getUniqueRandomArrayItems', () => {
  const initialArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
  const requestedItemsCount = 2; // [3, 1].length

  it('should call getUniqueRandomInts function with correct arguments', async () => {
    const mockGetUniqueRandomInts = vi.mocked(await import('./get-unique-random-ints')).getUniqueRandomInts;

    getUniqueRandomArrayItems(initialArray, requestedItemsCount);

    expect(mockGetUniqueRandomInts).toHaveBeenCalledWith(
      { from: 0, to: initialArray.length - 1 },
      requestedItemsCount
    );
  });

  it('should return array with "🍇" and "🍌"', () => {
    const result = getUniqueRandomArrayItems(initialArray, requestedItemsCount);
    expect(result).toEqual(['🍇', '🍌']);
  });
});

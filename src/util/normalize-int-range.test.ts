import { normalizeIntRange } from './normalize-int-range';

describe('Function: normalizeIntRange', () => {
  it('should return an array with 2 elements', () => {
    const from = 1;
    const to = 10;

    const result = normalizeIntRange(from, to);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
  });

  it('should return an array with 2 elements, sorted in ascending order', () => {
    expect(normalizeIntRange(1, 10)).toEqual([1, 10]);
    expect(normalizeIntRange(10, 1)).toEqual([1, 10]);
    expect(normalizeIntRange(-10, -1)).toEqual([-10, -1]);
    expect(normalizeIntRange(-1, -10)).toEqual([-10, -1]);
  });

  it('should round up the smaller of the two arguments', () => {
    expect(normalizeIntRange(1.1, 10)[0]).toBe(2);
    expect(normalizeIntRange(10, 1.5)[0]).toBe(2);
    expect(normalizeIntRange(1.9, 10)[0]).toBe(2);
  });

  it('should round down the larger of the two arguments', () => {
    expect(normalizeIntRange(1, 9.1)[1]).toBe(9);
    expect(normalizeIntRange(1, 9.5)[1]).toBe(9);
    expect(normalizeIntRange(9.9, 1)[1]).toBe(9);
  });

  it('should throw an error if there are no integers in the passed range', () => {
    expect(() => normalizeIntRange(1.1, 1.9)).toThrow();
  });
});

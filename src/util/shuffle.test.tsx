import { shuffle } from './shuffle';

describe('Function: shuffle', () => {
  const someArray = ['🍎', '🍌', '🍉', '🍇', '🍒', '🍊', '🍓', '🥕', '🍐', '🍑'];

  it('should return original array', () => {
    const initialArray = someArray.slice();

    const result = shuffle(initialArray);

    expect(result).toBeInstanceOf(Array);
    expect(result).toBe(initialArray);
  });

  it('should shuffle original array', () => {
    const initialArray = someArray.slice();
    const initialArrayCopy = initialArray.slice();

    const result = shuffle(initialArray);

    expect(result).toHaveLength(initialArray.length);
    expect(result).not.toEqual(initialArrayCopy);
    expect(result.toSorted()).toEqual(initialArray.toSorted());
  });

  it('should shuffle randomly', () => {
    const initialArray = someArray.slice();

    const result1 = shuffle(initialArray.slice());
    const result2 = shuffle(initialArray.slice());
    const result3 = shuffle(initialArray.slice());

    expect(result1).not.toEqual(result2);
    expect(result1).not.toEqual(result3);
    expect(result2).not.toEqual(result3);
  });
});

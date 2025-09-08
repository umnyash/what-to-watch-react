import { removeArrayItem } from './remove-array-item';

describe('Function: removeArrayItem', () => {
  it('should remove a primitive value from the array', () => {
    const initialArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
    const expectedArray = ['🍎', '🍌', '🍉', '🍒'];

    removeArrayItem(initialArray, '🍇');

    expect(initialArray).toEqual(expectedArray);
  });

  it('should modify the original array', () => {
    const initialArray = ['🍎', '🍌', '🍉', '🍇', '🍒'];
    const copyArray = initialArray.slice();

    removeArrayItem(copyArray, '🍇');

    expect(copyArray).not.toEqual(initialArray);
  });

  it('should revome an object from the array if the keys match completely or partially', () => {
    const initialArray = [
      { id: '1', name: 'Cecil' },
      { id: '2', name: 'Perry' },
      { id: '3', name: 'Tom' },
      { id: '4', name: 'Connor' },
      { id: '5', name: 'Reed' },
    ];
    const expectedArray = [
      { id: '1', name: 'Cecil' },
      { id: '5', name: 'Reed' },
    ];

    removeArrayItem(initialArray, { id: '2', name: 'Perry' });
    removeArrayItem(initialArray, { id: '3' });
    removeArrayItem(initialArray, { name: 'Connor' });

    expect(initialArray).toEqual(expectedArray);
  });

  it('should throw an error if the element to remove is not found in the array', () => {
    const initialArray1 = ['🍎', '🍌', '🍉', '🍇', '🍒'];
    const initialArray2 = [
      { id: '1', name: 'Cecil' },
      { id: '2', name: 'Perry' },
      { id: '3', name: 'Tom' },
      { id: '4', name: 'Connor' },
      { id: '5', name: 'Reed' },
    ];

    expect(() => removeArrayItem(initialArray1, '🥦')).toThrow();
    expect(() => removeArrayItem(initialArray2, { id: '100' })).toThrow();
  });
});

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

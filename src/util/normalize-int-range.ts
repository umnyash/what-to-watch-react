export const normalizeIntRange = (from: number, to: number) => {
  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

  if (min > max) {
    throw new Error(`There are no integers in the provided range from ${from} to ${to}.`);
  }

  return [min, max];
};

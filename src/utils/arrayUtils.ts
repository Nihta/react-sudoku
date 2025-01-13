/**
 * It takes an array of items and an array of items to delete, and returns a new
 * array with the items to delete removed.
 *
 * @param arr - The array to remove items from.
 * @param items - T[] - this is the array of items that you want to remove
 * from the array
 */
export const deleteValuesFromArray = <T>(arr: readonly T[], items: T[]) => {
  return arr.filter((item) => !items.includes(item));
};

/**
 * Get a random element from an array.
 */
export const getRandomElementFromArray = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * It takes an array and a function, and returns the number of elements in the
 * array that the function returns true for
 *
 * @param arr - The array to iterate over
 * @param fn - (item: T) => boolean - true if the item should be counted
 */
// prettier-ignore
export function countElements<T>(arr: readonly T[], fn: (item: T) => boolean): number {
  return arr.reduce((acc, item) => {
    if (fn(item)) {
      acc++;
    }
    return acc;
  }, 0);
}

export function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

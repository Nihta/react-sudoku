export const deleteValuesFromArray = <T>(arr: T[], items: T[]) => {
  return arr.filter((item) => !items.includes(item));
};

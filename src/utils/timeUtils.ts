/**
 * It takes a number of seconds and returns a string of the format "MM:SS"
 *
 * @param {number} time - number - the time in seconds that we want to convert
 * @returns A string with the time in minutes and seconds.
 */
export const convertTime = (time: number): string => {
  return (
    `${Math.floor(time / 60)}`.padStart(2, "0") +
    ":" +
    `${time % 60}`.padStart(2, "0")
  );
};

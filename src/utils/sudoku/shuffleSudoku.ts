const shuffleArray = <T>(array: readonly T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
};

const shuffleRow = (sudokuStr: string): string => {
  // ! row only shuffle in block
  const pattern = shuffleArray([0, 1, 2])
    .concat(shuffleArray([3, 4, 5]))
    .concat(shuffleArray([6, 7, 8]));

  let res = "";
  for (const i of pattern) {
    res += sudokuStr.slice(i * 9, i * 9 + 9);
  }
  return res;
};

const shuffleCol = (sudokuStr: string): string => {
  // ! col only shuffle in block
  const pattern = shuffleArray([0, 1, 2])
    .concat(shuffleArray([3, 4, 5]))
    .concat(shuffleArray([6, 7, 8]));
  let res = "";
  for (let row = 0; row < 9; row++) {
    const currRow = sudokuStr.slice(row * 9, row * 9 + 9);
    for (const j of pattern) {
      res += currRow[j];
    }
  }
  return res;
};

const shuffleBlockRow = (sudokuStr: string): string => {
  const pattern = shuffleArray([0, 1, 2]);

  let res = "";
  for (const i of pattern) {
    res += sudokuStr.slice(i * 27, i * 27 + 27);
  }
  return res;
};

const shuffleBlockCol = (sudokuStr: string): string => {
  const pattern = shuffleArray([0, 1, 2]);

  let res = "";
  for (let row = 0; row < 9; row++) {
    const currRow = sudokuStr.slice(row * 9, row * 9 + 9);
    for (const i of pattern) {
      res += currRow.slice(i * 3, i * 3 + 3);
    }
  }
  return res;
};

/**
 * Randomly rotate sudoku left or right or not at all
 */
const rotateSudoku = (sudokuStr: string): string => {
  // -1: left, 0: none, 1: right
  const rotate = [-1, 0, 1][Math.floor(Math.random() * 3)];
  if (rotate === 0) return sudokuStr;
  let res = "";
  if (rotate === -1) {
    for (let i = 8; i >= 0; i--) {
      for (let j = 0; j <= 8; j++) {
        res += sudokuStr[j * 9 + i];
      }
    }
  }
  if (rotate === 1) {
    for (let i = 0; i <= 8; i++) {
      for (let j = 8; j >= 0; j--) {
        res += sudokuStr[j * 9 + i];
      }
    }
  }
  return res;
};

/**
 * Shuffle symbols
 *
 *  - input:  H4GAEC92FFA29G85CDCIEDB6GHA1ECFHDBI7IBHG3AFDEGF45I28ACB7F3A9DE8EHAB4G3FIDC9H6EAGB
 *  - output: H2DAGI56CCA65D87IBIEGBF3DHA1GICHBFE4EFHD9ACBGDC27E68AIF4C9A5BG8GHAF2D9CEBI5H3GADF
 */
const shuffleSymbols = (sudokuStr: string): string => {
  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  const shuffledNums = shuffleArray(nums);
  const shuffledChars = [];

  for (const num of shuffledNums) {
    shuffledChars.push(chars[parseInt(num, 10) - 1]);
  }

  const numMap = new Map();
  const charMap = new Map();
  for (let i = 0; i < 9; i++) {
    numMap.set(nums[i], shuffledNums[i]);
    charMap.set(chars[i], shuffledChars[i]);
  }

  let res = "";
  for (const c of sudokuStr) {
    if (numMap.has(c)) res += numMap.get(c);
    else res += charMap.get(c);
  }

  return res;
};

export const shuffleSudoku = (encodedSudoku: string): string => {
  let res = shuffleSymbols(encodedSudoku);
  res = shuffleRow(encodedSudoku);
  res = shuffleCol(res);
  res = shuffleBlockRow(res);
  res = shuffleBlockCol(res);
  res = rotateSudoku(res);
  return res;
};

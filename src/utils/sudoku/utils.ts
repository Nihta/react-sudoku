import { Note } from "../../types/sudokuTypes";

export const getIdxByBlock = (block: number) => {
  const startRow = Math.floor(block / 3) * 3;
  const startCol = (block % 3) * 3;
  const idxArr = [];
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      idxArr.push(i * 9 + j);
    }
  }
  return idxArr;
};

export const getIdxByRow = (row: number) => {
  const idxArr = [];
  for (let col = 0; col < 9; col++) {
    idxArr.push(row * 9 + col);
  }
  return idxArr;
};

export const getIdxByCol = (col: number) => {
  return Array.from({ length: 9 }, (_, i) => i * 9 + col);
};

export const getFreqOfNotes = (arrNote: Note[]) => {
  const freq = new Map<number, { count: number; positions: number[] }>();
  arrNote.forEach((note) => {
    note.forEach((num) => {
      if (freq.has(num)) {
        const { count, positions } = freq.get(num)!;
        freq.set(num, {
          count: count + 1,
          positions: [...positions, arrNote.indexOf(note)],
        });
      } else {
        freq.set(num, {
          count: 1,
          positions: [arrNote.indexOf(note)],
        });
      }
    });
  });
  return freq;
};

export const isSameRow = (idx1: number, idx2: number) => {
  const row = Math.floor(idx1 / 9);
  const isSameRow = row === Math.floor(idx2 / 9);
  return isSameRow ? row : false;
};

export const isSameCol = (idx1: number, idx2: number) => {
  const col = idx1 % 9;
  const isSameCol = col === idx2 % 9;
  return isSameCol ? col : false;
};

export const isSameBlock = (idx1: number, idx2: number) => {
  const block = Math.floor(idx1 / 27) * 3 + Math.floor((idx1 % 9) / 3);
  const isSame =
    block === Math.floor(idx2 / 27) * 3 + Math.floor((idx2 % 9) / 3);
  return isSame ? block : false;
};

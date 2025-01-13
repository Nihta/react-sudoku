import { setNote } from "../../zustand/Sudoku";
import useSudokuStore from "../../zustand/useSudokuStore";
import {
  getFreqOfNotes,
  getIdxByBlock,
  getIdxByCol,
  isSameCol
} from "./utils";

/**
 * Áp dụng "Cặp loại trừ" khi một Ghi chú xuất hiện hai lần trong một khối và
 * Ghi chú này cũng thuộc cùng một hàng hoặc cột. Điều này có nghĩa là Ghi chú
 * chắc chắn phải là lời giải cho một trong hai ô trong khối. Vì vậy, bạn có thể
 * loại bỏ Ghi chú này khỏi bất kỳ ô nào khác trong hàng hoặc cột.
 */
export const pointingPairs = () => {
  const notes = useSudokuStore.getState().notes;

  let foundFlag = false;

  const commonHandel = (arrIdx: number[]) => {
    if (foundFlag) return;
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const freq = getFreqOfNotes(arrNote);

    // Nếu có một số xuất hiện chính xác hai lần thì kiểm tra xem chúng có cùng hàng hay cột không
    for (const [num, { count, positions }] of freq) {
      if (count === 2) {
        const realPositions = positions.map((pos) => arrIdx[pos]);
        const [pos1, pos2] = realPositions;
        const isSameRowResult = isSameCol(pos1, pos2);
        if (isSameRowResult !== false) {
          const sameRowIdx = getIdxByCol(isSameRowResult).filter(
            (idx) => !realPositions.includes(idx)
          );
          sameRowIdx.forEach((idx) => {
            const note = notes[idx];
            if (note.includes(num)) {
              foundFlag = true;
              // notes[idx] = note.filter((n) => n !== num);
              const newNote = note.filter((n) => n !== num);
              setNote(
                idx,
                note.filter((n) => n !== num)
              );
              console.log(`Change note[${idx}] = ${newNote}`);
            }
          });
          break;
        }

        const isSameColResult = isSameCol(pos1, pos2);
        if (isSameColResult !== false) {
          const sameColIdx = getIdxByCol(isSameColResult).filter(
            (idx) => !realPositions.includes(idx)
          );
          sameColIdx.forEach((idx) => {
            const note = notes[idx];
            if (note.includes(num)) {
              foundFlag = true;
              // notes[idx] = note.filter((n) => n !== num);
              setNote(
                idx,
                note.filter((n) => n !== num)
              );
            }
          });
          break;
        }
      }
    }
  };

  // for each block
  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    commonHandel(arrIdx);
  }

  return foundFlag;
};

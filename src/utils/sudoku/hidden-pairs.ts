// hidden-pairs

import { ETechnique } from "../../modules/sudoku/technique.type.ts";
import useSudokuStore from "../../zustand/useSudokuStore";
import { getIdxByBlock } from "./utils";

function findHiddenPairs(notes: number[][]): {
  pair: [number, number];
  positions: [number, number];
} | null {
  // Kiểm tra input hợp lệ
  if (notes.length !== 9) {
    throw new Error("The input must have exactly 9 cells");
  }

  // Tạo map để theo dõi các số xuất hiện ở đâu
  const numberPositions = new Map<number, number[]>();

  // Duyệt qua từng ô và ghi nhận vị trí của các số
  notes.forEach((cell, cellIndex) => {
    cell.forEach((num) => {
      if (!numberPositions.has(num)) {
        numberPositions.set(num, []);
      }
      numberPositions.get(num)?.push(cellIndex);
    });
  });

  // Tìm các số chỉ xuất hiện ở 2 vị trí
  const candidateNumbers: number[] = [];
  numberPositions.forEach((positions, num) => {
    if (positions.length === 2) {
      candidateNumbers.push(num);
    }
  });

  // Kiểm tra các cặp số có cùng xuất hiện ở 2 vị trí không
  for (let i = 0; i < candidateNumbers.length - 1; i++) {
    for (let j = i + 1; j < candidateNumbers.length; j++) {
      const num1 = candidateNumbers[i];
      const num2 = candidateNumbers[j];

      const positions1 = numberPositions.get(num1) || [];
      const positions2 = numberPositions.get(num2) || [];

      // Kiểm tra xem 2 số có cùng xuất hiện ở đúng 2 vị trí không
      if (
        positions1.length === 2 &&
        positions2.length === 2 &&
        positions1[0] === positions2[0] &&
        positions1[1] === positions2[1]
      ) {
        // Kiểm tra xem có phải là hidden pair không
        const pos1 = positions1[0];
        const pos2 = positions1[1];

        // Kiểm tra các ô khác không chứa 2 số này
        const isHidden = notes.every((cell, index) => {
          if (index !== pos1 && index !== pos2) {
            return !cell.includes(num1) && !cell.includes(num2);
          }
          return true;
        });

        const positions = [pos1, pos2].sort((a, b) => a - b);

        if (isHidden) {
          return {
            pair: [num1, num2] as [number, number],
            positions: positions as [number, number],
          };
        }
      }
    }
  }

  return null;
}

// Kỹ thuật "Hidden pairs" hoạt động giống như "Hidden singles".
// Điều duy nhất thay đổi là số lượng ô và Ghi chú. Nếu bạn có thể tìm thấy hai
// ô trong một hàng, cột hoặc khối 3x3 trong đó hai Ghi chú không xuất hiện ở đâu bên ngoài các ô này, hai Ghi chú này phải được đặt trong hai ô. Tất cả các Ghi chú khác có thể được loại bỏ khỏi hai ô này.
export const hiddenPairs = () => {
  const notes = useSudokuStore.getState().notes;

  const commonHandel = (
    arrIdx: number[],
    type: "row" | "col" | "block",
    typeIdx: number
  ) => {
    const arrNote = arrIdx.map((idx) => notes[idx]);
    const found = findHiddenPairs(arrNote);
    if (found) {
      /** Mapping to real index of notes */
      const foundPositions = found.positions.map((pos) => arrIdx[pos]);
      const [first, second] = foundPositions;

      // * ensure: at least one note has more than 2 notes
      if (notes[first].length > 2 && notes[second].length > 2) {
        return {
          type: ETechnique.hiddenPairs,
          payload: {
            type: type,
            typeDetail: typeIdx,
            notePositions: foundPositions,
            pair: found.pair,
          },
        };
      }
    }

    return null;
  };

  // row
  for (let row = 0; row < 9; row++) {
    const arrIdx = Array.from({ length: 9 }, (_, i) => row * 9 + i);
    const res = commonHandel(arrIdx, "row", row);
    if (res) {
      return res;
    }
  }

  // col
  for (let col = 0; col < 9; col++) {
    const arrIdx = Array.from({ length: 9 }, (_, i) => i * 9 + col);
    const res = commonHandel(arrIdx, "col", col);
    if (res) {
      return res;
    }
  }

  // block
  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const arrIdx = getIdxByBlock(blockIdx);
    const res = commonHandel(arrIdx, "block", blockIdx);
    if (res) {
      return res;
    }
  }

  return null;
};

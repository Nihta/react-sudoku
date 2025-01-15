import { ETechnique } from "../../types/technique.type";
import {
  addHistory,
  clickCell,
  setCellVal,
  setNote,
  setNotes,
} from "../../zustand/Sudoku";
import useSudokuStore from "../../zustand/useSudokuStore";
import { preHandle } from "../sudokuRules";
import { getNewNotes } from "./fillNote";
import { hiddenPairs } from "./hidden-pairs";
import { hiddenSingles } from "./hiddenSingles";
import { lastFreeCell } from "./lastFreeCell";
import { lastPossibleNumber } from "./lastPossibleNumber";
import { lastRemainingCell } from "./lastRemainingCell";
import { obviousPairs } from "./obviousPairs";
import { obviousSingles } from "./obviousSingles";
import { obviousTriples } from "./obviousTriples";
import { pointingPairs } from "./pointingPairs";

// 1: Ghi chú
// 2: Bộ đôi ẩn
// 3: Ô đơn ẩn
// 4: Ghi chú
// 5: Ô đơn ẩn
// 6: Ghi chú
// 7: Bộ đôi rõ ràng
// 8: Bộ đôi chỉ hướng
// 9: Bộ đôi chỉ hướng
// 10: Bộ đôi chỉ hướng
// 11: Ô đơn ẩn
// 12: Ô còn lại
// 13: Ô còn lại
// 14: Ô còn lại
// 15: Ô còn lại
// 15: Ô còn lại
// 15: Ô còn lại
// 15: Ô còn lại
// 15: Ô còn lại

// 15: Ô còn lại ?
// ?: Ô trống cuối cùng
// ?: Ô trống cuối cùng
// ?: Ô trống cuối cùng

// còn lại

/**
 *
 */
export const hint = () => {
  const { rows, cols, cells, blocks } = preHandle();


  // console.info("Hint stop here");
  // return;

  const lfcTech = lastFreeCell({ cells, rows, cols, blocks });
  if (lfcTech && lfcTech.type === ETechnique.lastFreeCell) {
    const { payload } = lfcTech;
    console.info("Last Free Cell", payload);
    addHistory();
    clickCell(payload.correct.pos);
    setCellVal(payload.correct.pos, payload.correct.value, true);
    return;
  }

  const res = lastRemainingCell({ cells, rows, cols, blocks });
  if (res && res.type === ETechnique.lastRemainingCell) {
    console.info("Last remaining cell", res.payload);
    addHistory();
    clickCell(res.payload.position);
    setCellVal(res.payload.position, res.payload.value, true);
    return;
  }

  const lpnTech = lastPossibleNumber({ cells, rows, cols, blocks });
  if (lpnTech && lpnTech.type === ETechnique.lastPossibleNumber) {
    console.info("Số có thể cuối cùng", lpnTech.payload);
    addHistory();
    clickCell(lpnTech.payload.position);
    setCellVal(lpnTech.payload.position, lpnTech.payload.value, true);
    return;
  }

  // Always check notes first
  const { change, newNotes } = getNewNotes();

  if (change > 0) {
    addHistory();
    // Để tiến tới đáp án, phải điền đúng tất cả các số có thể cho mỗi ô dưới dạng ghi chú
    console.info(
      `Ghi chú trong các ô này bị thiếu hoặc được điền không đúng. (change=${change})`
    );
    setNotes(newNotes);
    return;
  }

  const notes = useSudokuStore.getState().notes;

  const oSRes = obviousSingles();
  if (oSRes && oSRes.type === ETechnique.obviousSingles) {
    console.info("Obvious Singles", oSRes.payload);
    addHistory();
    clickCell(oSRes.payload.position);
    setCellVal(oSRes.payload.position, oSRes.payload.value, true);
    return;
  }

  const hsRes = hiddenSingles();
  if (hsRes && hsRes.type === ETechnique.hiddenSingles) {
    const pl = hsRes.payload;
    console.info(
      `Số ẩn: ${pl.type} ${pl.typeDetail} | cell ${pl.position} -> ${pl.value}`
    );
    addHistory();
    clickCell(hsRes.payload.position);
    setCellVal(hsRes.payload.position, hsRes.payload.value, true);
    return;
  }

  const opRes = obviousPairs();
  if (opRes && opRes.type === ETechnique.obviousPairs) {
    const pl = opRes.payload;

    console.info(
      `Obvious Pairs: ${pl.type} ${pl.typeDetail} | ${pl.pair} | ${pl.notePositions}`
    );

    // update notes
    addHistory();
    opRes.payload.notePositions.forEach((pos) => {
      const currentNote = notes[pos];
      const newNote = currentNote.filter((note) => !pl.pair.includes(note));
      setNote(pos, newNote);
    });
    // click last note for visual effect
    clickCell(opRes.payload.notePositions.slice(-1)[0]);

    return;
  }

  const hpRes = hiddenPairs();
  if (hpRes && hpRes.type === ETechnique.hiddenPairs) {
    const pl = hpRes.payload;

    console.info("Bộ đôi ẩn", pl);

    addHistory();

    // update notes
    hpRes.payload.notePositions.forEach((pos) => {
      setNote(pos, [...pl.pair].sort());
    });
    // click last note for visual effect
    clickCell(hpRes.payload.notePositions.slice(-1)[0]);

    return;
  }

  const otTech = obviousTriples();
  if (otTech && otTech.type === ETechnique.obviousTriples) {
    const { payload } = otTech;
    console.info("Obvious Triples", payload);
    addHistory();

    // update notes
    payload.notes.forEach((pos) => {
      const currentNote = useSudokuStore.getState().notes[pos];
      const newNote = currentNote.filter((n) => !payload.triple.includes(n));
      setNote(pos, newNote);
    });
    // click last note for visual effect
    clickCell(payload.notes.slice(-1)[0]);
    return;
  }


  const ppRes = pointingPairs();
  if (ppRes && ppRes.type === ETechnique.pointingPairs) {
    console.info(`Bộ đôi chỉ hướng`, ppRes.payload);

    addHistory();

    // update notes
    ppRes.payload.notePositions.forEach((pos) => {
      const currentNote = notes[pos];
      const newNote = currentNote.filter(
        (note) => note !== ppRes.payload.number
      );
      setNote(pos, newNote);
    });
    // click last note for visual effect
    clickCell(ppRes.payload.notePositions.slice(-1)[0]);

    return;
  }

  // todo: Free Cell - Select a cell you'd like to solve
  console.info("Không tìm thấy gợi ý nào :((");
};

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

export const hint = (): boolean => {
  const { rows, cols, cells, blocks } = preHandle();

  // console.info("Hint stop here");
  //  return true;

  const lfcTech = lastFreeCell({ cells, rows, cols, blocks });
  if (lfcTech && lfcTech.type === ETechnique.lastFreeCell) {
    const { payload } = lfcTech;
    console.info("Last Free Cell", payload);
    addHistory();
    clickCell(payload.correct.pos);
    setCellVal(payload.correct.pos, payload.correct.value, true);
    return true;
  }

  const res = lastRemainingCell({ cells, rows, cols, blocks });
  if (res && res.type === ETechnique.lastRemainingCell) {
    console.info("Last remaining cell", res.payload);
    addHistory();
    clickCell(res.payload.position);
    setCellVal(res.payload.position, res.payload.value, true);
    return true;
  }

  const lpnTech = lastPossibleNumber({ cells, rows, cols, blocks });
  if (lpnTech && lpnTech.type === ETechnique.lastPossibleNumber) {
    console.info("Last Possible Number", lpnTech.payload);
    addHistory();
    clickCell(lpnTech.payload.position);
    setCellVal(lpnTech.payload.position, lpnTech.payload.value, true);
    return true;
  }

  // Always check notes first
  const { change, newNotes } = getNewNotes();

  if (change > 0) {
    addHistory();
    console.info(`New notes: ${change}`);
    setNotes(newNotes);
    return true;
  }

  const notes = useSudokuStore.getState().notes;

  const oSRes = obviousSingles();
  if (oSRes && oSRes.type === ETechnique.obviousSingles) {
    console.info("Obvious Singles", oSRes.payload);
    addHistory();
    clickCell(oSRes.payload.position);
    setCellVal(oSRes.payload.position, oSRes.payload.value, true);
    return true;
  }

  const hsRes = hiddenSingles();
  if (hsRes && hsRes.type === ETechnique.hiddenSingles) {
    const pl = hsRes.payload;
    console.info("Hidden Single", pl);
    addHistory();
    clickCell(hsRes.payload.position);
    setCellVal(hsRes.payload.position, hsRes.payload.value, true);
    return true;
  }

  const opRes = obviousPairs();
  if (opRes && opRes.type === ETechnique.obviousPairs) {
    const pl = opRes.payload;

    console.info(`Obvious Pairs`, pl);

    // update notes
    addHistory();
    opRes.payload.notePositions.forEach((pos) => {
      const currentNote = notes[pos];
      const newNote = currentNote.filter((note) => !pl.pair.includes(note));
      setNote(pos, newNote);
    });
    // click last note for visual effect
    clickCell(opRes.payload.notePositions.slice(-1)[0]);

    return true;
  }

  const hpRes = hiddenPairs();
  if (hpRes && hpRes.type === ETechnique.hiddenPairs) {
    const pl = hpRes.payload;

    console.info("Hidden Pairs", pl);

    addHistory();

    // update notes
    hpRes.payload.notePositions.forEach((pos) => {
      setNote(pos, [...pl.pair].sort());
    });
    // click last note for visual effect
    clickCell(hpRes.payload.notePositions.slice(-1)[0]);

    return true;
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
    return true;
  }

  const ppRes = pointingPairs();
  if (ppRes && ppRes.type === ETechnique.pointingPairs) {
    console.info(`Pointing Pairs`, ppRes.payload);

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

    return true;
  }

  console.info("No hint found");
  return false;
};

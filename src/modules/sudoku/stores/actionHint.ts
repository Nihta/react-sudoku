import { produce } from "immer";
import toast from "react-hot-toast";
import { ETechnique } from "../technique.type.ts";
import {
  getIdxByBlock,
  getIdxByCol,
  getIdxByRow,
} from "../../../utils/sudoku/utils";
import { hiddenPairs } from "../technique/hiddenPairs";
import { hiddenSingles } from "../technique/hiddenSingles";
import { lastPossibleNumber } from "../technique/lastPossibleNumber";
import { lastRemainingCell } from "../technique/lastRemainingCell";
import { obviousPairs } from "../technique/obviousPairs";
import { obviousTriples } from "../technique/obviousTriples";
import { pointingPairs } from "../technique/pointingPairs";
import { preHandle } from "../utils";
import { reCalculateBoard } from "../utils/reCalculateBoard";
import { setCellValue } from "./actionInputCell";
import { getNewNotes } from "./actionNote";
import { setCells, SudokuState, useBoardStore } from "./useBoard";
// import toast from "react-hot-toast";

const smartHint = () => {
  const cells = useBoardStore.getState().cells;
  const { rows, cols, cells: orgCells, blocks } = preHandle(cells);

  const res = lastRemainingCell({ cells: orgCells, rows, cols, blocks });
  if (res && res.type === ETechnique.lastRemainingCell) {
    const { payload } = res;

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: "Last remaining cell",
          setValues: [{ position: payload.position, value: payload.value }],
        };
      })
    );

    if (payload.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
        });

        draft[payload.position].selected = true;
        draft[payload.position].blinkValue = payload.value;

        // high light related cells: row, col
        payload.rowRelated.forEach((rowIdx) => {
          getIdxByRow(rowIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.colRelated.forEach((colIdx) => {
          getIdxByCol(colIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.blockRelated.forEach((blockIdx) => {
          getIdxByBlock(blockIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });
      })
    );

    return true;
  }

  const lpnRes = lastPossibleNumber({ cells: orgCells, rows, cols, blocks });
  if (lpnRes && lpnRes.type === ETechnique.lastPossibleNumber) {
    const { payload } = lpnRes;

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: "Last possible number",
          setValues: [{ position: payload.position, value: payload.value }],
        };
      })
    );

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
          cell.blinkValue = undefined;
        });

        // blink value for found cell
        draft[payload.position].selected = true;
        draft[payload.position].blinkValue = payload.value;

        // high light related cells: row, col
        payload.rowRelated.forEach((rowIdx) => {
          getIdxByRow(rowIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.colRelated.forEach((colIdx) => {
          getIdxByCol(colIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });

        payload.blockRelated.forEach((blockIdx) => {
          getIdxByBlock(blockIdx).forEach((idx) => {
            draft[idx].status = "high-light";
            if (draft[idx].value === payload.value) {
              draft[idx].status = "high-light-number";
            }
          });
        });
      })
    );
    return true;
  }

  // Always check notes first
  const { change, newNotes, arrIdx } = getNewNotes();
  if (change > 0) {
    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: "Notes",
          // setValues: [],
          setNotes: arrIdx.map((idx) => ({
            position: idx,
            notes: newNotes[idx],
          })),
        };
      })
    );

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
          cell.blinkValue = undefined;
        });

        arrIdx.forEach((idx) => {
          draft[idx].status = "high-light";
        });
      })
    );

    return true;
  }

  const hsRes = hiddenSingles();
  if (hsRes && hsRes.type === ETechnique.hiddenSingles) {
    const payload = hsRes.payload;

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: "Hidden Single",
          setValues: [{ position: payload.position, value: payload.value }],
        };
      })
    );

    if (payload.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.blinkValue = undefined;
        });

        // set blink value for found cell
        draft[payload.position].selected = true;
        draft[payload.position].blinkValue = payload.value;
      })
    );

    return true;
  }

  const opRes = obviousPairs();
  if (opRes && opRes.type === ETechnique.obviousPairs) {
    const payload = opRes.payload;

    console.info(`Obvious Pairs`, payload);

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: `Obvious Pairs: ${payload.pair.join(", ")}`,
          setNotes: payload.setNotes,
        };
      })
    );

    if (payload.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.blinkValue = undefined;
        });

        payload.highlightCellIdx.forEach((idx) => {
          draft[idx].status = "high-light";
        });
      })
    );

    return true;
  }

  const hpRes = hiddenPairs();
  if (hpRes && hpRes.type === ETechnique.hiddenPairs) {
    const payload = hpRes.payload;

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: `Hidden Pairs: ${payload.pair.join(", ")}`,
          setNotes: payload.setNotes,
        };
      })
    );

    if (payload.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.blinkValue = undefined;
        });

        payload.highlightCellIdx.forEach((idx) => {
          draft[idx].status = "high-light";
        });
      })
    );

    return true;
  }

  const otTech = obviousTriples();
  if (otTech && otTech.type === ETechnique.obviousTriples) {
    const { payload } = otTech;

    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: `Obvious Triples: ${payload.triple.join(", ")}`,
          setNotes: payload.notes.map((pos) => {
            const currentNote = draft.notes[pos];
            const newNote = currentNote.filter(
              (note) => !payload.triple.includes(note)
            );
            return {
              position: pos,
              notes: newNote,
            };
          }),
        };
      })
    );

    if (payload.detail.type === "block") {
      useBoardStore.setState({ highlightBlocks: [payload.detail.value] });
    } else if (payload.detail.type === "row") {
      useBoardStore.setState({ highlightRows: [payload.detail.value] });
    } else if (payload.detail.type === "col") {
      useBoardStore.setState({ highlightCols: [payload.detail.value] });
    }

    // highlight related cells
    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.selected = false;
        });

        payload.rowRelated.forEach((rowIdx) => {
          getIdxByRow(rowIdx).forEach((idx) => {
            draft[idx].status = "high-light";
          });
        });

        payload.colRelated.forEach((colIdx) => {
          getIdxByCol(colIdx).forEach((idx) => {
            draft[idx].status = "high-light";
          });
        });

        payload.blockRelated.forEach((blockIdx) => {
          getIdxByBlock(blockIdx).forEach((idx) => {
            draft[idx].status = "high-light";
          });
        });
      })
    );

    return true;
  }

  const ppRes = pointingPairs();
  if (ppRes && ppRes.type === ETechnique.pointingPairs) {
    const payload = ppRes.payload;
    useBoardStore.setState({ mode: "hint" });
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.hintActions = {
          title: `Pointing Pairs: ${payload.number}`,
          setNotes: payload.setNotes,
        };
      })
    );

    if (payload.type.startsWith("block")) {
      useBoardStore.setState({ highlightBlocks: [payload.typeDetail] });
    } else if (payload.type.startsWith("row")) {
      useBoardStore.setState({ highlightRows: [payload.typeDetail] });
    } else if (payload.type.startsWith("col")) {
      useBoardStore.setState({ highlightCols: [payload.typeDetail] });
    }

    setCells(
      produce(cells, (draft) => {
        // clear all status
        draft.forEach((cell) => {
          cell.status = "normal";
          cell.blinkValue = undefined;
        });

        payload.highlightCellIdx.forEach((idx) => {
          draft[idx].status = "high-light";
        });
      })
    );

    return true;
  }

  return false;
};

export const doActionHint = () => {
  // toast.error("You are already in hint mode");

  const hintActions = useBoardStore.getState().hintActions;

  hintActions?.setValues?.forEach((action) => {
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.cells[action.position].value = action.value;
        draft.cells[action.position].blinkValue = undefined;
        draft.cells[action.position].isOrigin = true;
        draft.notes[action.position] = [];
      })
    );
  });

  hintActions?.setNotes?.forEach((action) => {
    useBoardStore.setState(
      produce((draft: SudokuState) => {
        draft.notes[action.position] = action.notes;
      })
    );
  });

  useBoardStore.setState(
    produce((draft: SudokuState) => {
      draft.highlightBlocks = [];
      draft.highlightRows = [];
      draft.highlightCols = [];
      draft.hintActions = undefined;
      // todo: how to know if it is in note mode or normal mode
      draft.mode = "normal";
    })
  );

  reCalculateBoard();
};

export const actionHint = () => {
  // do hint actions
  const mode = useBoardStore.getState().mode;
  if (mode === "hint") {
    doActionHint();
    return;
  }

  // if no cell selected, do nothing
  const selectedCell = useBoardStore.getState().selectedCell;
  if (selectedCell === undefined) {
    const res = smartHint();
    if (!res) {
      toast.error("No hint found, try Free Cell hint");
    }
    return;
  }

  // if cell is origin, try smart hint
  const cells = useBoardStore.getState().cells;
  const cell = cells[selectedCell];
  if (cell.isOrigin) {
    const res = smartHint();
    if (!res) {
      toast.error("No hint found, try Free Cell hint");
    }
    return;
  }

  // fill cell with correct value
  const puzzle = useBoardStore.getState().puzzle;
  if (puzzle === undefined) {
    toast.error("No puzzle found");
    throw new Error("No puzzle found");
  }

  const correctValue = puzzle[1][selectedCell];
  if (!correctValue || correctValue === "0") {
    toast.error("No correct value found");
    throw new Error("No correct value found");
  }

  setCellValue({
    idx: selectedCell,
    value: parseInt(correctValue, 10),
    origin: true,
  });
  reCalculateBoard();
};

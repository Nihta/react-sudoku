import useSudokuStore, { SudokuState } from "./useSudokuStore";

import { produce } from "immer";
import { useGameStore } from "./useGameStore";
import {
  CellState,
  Note,
  Notes,
  Position,
  PuzzleData,
} from "../types/sudokuTypes";
import {
  convertPuzzle,
  countConflict,
  countEmpty,
  decodeSudokuPuzzle,
  getCorrectNumber,
  highLight,
} from "../utils/sudoku";
import { getRandomElementFromArray } from "../utils/arrayUtils";
import { dataPuzzles } from "../data/sudokuPuzzles";
import { shuffleSudoku } from "../utils/sudoku/shuffleSudoku";
import { hint } from "../utils/sudoku/hint";

/**
 * Pre handle action
 *
 * If game state is `won` or `paused`, return false
 */
const canDoAction = () => {
  const gameState = useGameStore.getState().gameState;
  const setGameState = useGameStore.getState().setGameState;
  if (gameState === "won" || gameState === "paused") {
    if (gameState === "paused") {
      setGameState("playing");
    }
    return false;
  }
  return true;
};

/**
 * Save current state to history:
 *  - cells
 *  - notes
 *  - selectedCell
 */
export const addHistory = () => {
  useSudokuStore.setState(
    produce((state: SudokuState) => {
      state.history.push({
        cells: state.cells,
        notes: state.notes,
        selectedCell: state.selectedCell,
      });
      // todo: why 729?
      if (state.history.length > 729) {
        state.history.shift();
      }
    })
  );
};

/**
 * Call this function to increase time by 1
 */
export const incTime = () => {
  const { time } = useSudokuStore.getState();
  useSudokuStore.setState({ time: time + 1 });
};

/**
 * Action new game
 */
export const actionNewGame = () => {
  const difficulty = useGameStore.getState().difficulty;

  const puzzle = decodeSudokuPuzzle(
    // todo: on shuffle
    shuffleSudoku(getRandomElementFromArray(dataPuzzles[difficulty]))
    // getRandomElementFromArray(dataPuzzles[difficulty])
  );
  setPuzzle(puzzle);
};

/**
 * There are 2 scenarios when using hint:
 *   1. If the selected cell already has a value (origin), try to solve the sudoku using common techniques
 *   2. If the selected cell has no value, try to solve the sudoku using common techniques, if no hint found, fill the correct number
 */
export const actionHint = () => {
  if (!canDoAction()) return;

  const currCell = getCurrentCell();
  if (!currCell) {
    throw new Error("No cell selected!");
  }

  if (currCell.cell.isOrigin) {
    hint();
    return;
  }

  const puzzle = useSudokuStore.getState().puzzle;
  if (!puzzle) {
    throw new Error("No puzzle to hint!");
  }

  // If no hint found, fill correct number
  const found = hint();
  if (!found) {
    const { pos } = currCell;
    addHistory();
    const correctNumber = getCorrectNumber(puzzle, pos);
    setCellVal(pos, correctNumber, true);
  }
};

/**
 * Delete value of selected cell
 */
export const deleteCell = (pos: number) => {
  setCellVal(pos, null);
};

/**
 * Get current cell (selected cell)
 */
function getCurrentCell() {
  const { selectedCell, cells } = useSudokuStore.getState();
  if (selectedCell === undefined) return null;
  return {
    cell: cells[selectedCell],
    pos: selectedCell,
  };
}

export const actionDelete = () => {
  if (!canDoAction()) return;

  const { notes } = useSudokuStore.getState();

  const currCell = getCurrentCell();
  if (!currCell || currCell.cell.isOrigin) return;

  addHistory();

  // If it has note, delete note
  if (notes[currCell.pos].length > 0) {
    setNote(currCell.pos, []);
  } else {
    deleteCell(currCell.pos);
  }
};

export const actionUndo = () => {
  if (!canDoAction()) return;
  const { history } = useSudokuStore.getState();
  if (history.length === 0) return;
  // delete last history and set to state
  useSudokuStore.setState({
    ...history[history.length - 1],
    history: history.slice(0, history.length - 1),
  });
};

/**
 * Toggle note mode
 */
export const actionNote = () => {
  if (!canDoAction()) return;
  const { noteMode } = useSudokuStore.getState();
  useSudokuStore.setState({ noteMode: !noteMode });
};

/**
 * The initial state of the game
 * @param puzzle
 */
export function setPuzzle(puzzle: PuzzleData) {
  const { cells, cellEmpty } = convertPuzzle(puzzle);
  const setGameState = useGameStore.getState().setGameState;
  useSudokuStore.setState({
    puzzle,
    cells,
    cellEmpty,
    cellConflict: countConflict(cells),
    history: [],
    selectedCell: undefined,
    time: 0,
    notes: Array.from({ length: 81 }, () => []),
    noteMode: false,
  });
  setGameState("playing");
}

export function clickCell(pos: number) {
  // * Khi chien thang tro choi van cho phep di chuyen
  const gameState = useGameStore.getState().gameState;
  const setGameState = useGameStore.getState().setGameState;
  if (gameState !== "won" && gameState === "paused") {
    setGameState("playing");
    return;
  }

  useSudokuStore.setState(
    produce((state: SudokuState) => {
      const currCell = state.selectedCell;

      // bo chon cell cu
      // * currCell có thể bằng 0 là
      if (currCell !== undefined) {
        state.cells[currCell].selected = false;
      }

      // Chọn cell mới
      state.selectedCell = pos;
      state.cells[pos].selected = true;

      // Highlight lại
      highLight(state.cells, pos);
    })
  );
}

//todo: xem xet co nen doi ten no thanh actionInputCell khong
export function inputCell(newVal: CellState["value"]) {
  if (!canDoAction()) return;

  const { noteMode } = useSudokuStore.getState();

  // If not selected cell, or selected cell is origin, can't change
  const currCell = getCurrentCell();
  if (!currCell || currCell.cell.isOrigin) return;

  // Truoc khi thay doi trang thai thi can luu lai
  addHistory();

  if (noteMode) {
    // ham nay tu dong set cell val = null
    setNoteVal(currCell.pos, newVal);
  } else {
    // ham nay tu dong xoa note new val != null
    setCellVal(currCell.pos, newVal);
  }
}

export function setNote(pos: number, values: Note) {
  useSudokuStore.setState(
    produce((state: SudokuState) => {
      state.notes[pos] = values;
    })
  );
  // Neu cell co gia tri thi xoa no di
  const currCell = getCurrentCell();
  if (currCell?.cell.value) {
    setCellVal(pos, null);
  }
}

export function setNoteVal(pos: number, val: CellState["value"]) {
  const { notes, noteMode } = useSudokuStore.getState();
  const note = notes[pos];
  if (noteMode && val) {
    if (note.includes(val)) {
      setNote(
        pos,
        note.filter((n) => n !== val)
      );
    } else {
      setNote(pos, [...note, val]);
    }
  }
}

/**
 * Set notes dong thoi phai xoa cac so xung dot
 */
export function setNotes(notes: Notes) {
  useSudokuStore.setState(
    produce((st: SudokuState) => {
      st.notes = notes;
      notes.forEach((note, idx) => {
        if (note.length > 0) {
          st.cells[idx].value = null;
        }
      });

      highLight(st.cells, st.selectedCell ?? 36);
    })
  );
}

/**
 * Fill a value into a cell
 *
 * Do not add to history, automatically delete note if the entered value
 * is not null (because when entering note, it sets val = null)
 */
export function setCellVal(
  pos: number,
  newVal: CellState["value"],
  setOrigin?: boolean
) {
  const setGameState = useGameStore.getState().setGameState;

  useSudokuStore.setState(
    produce((state: SudokuState) => {
      const cell = state.cells[pos];

      if (cell.value === newVal) {
        cell.value = null;
      } else {
        cell.value = newVal;
        if (setOrigin) {
          cell.isOrigin = true;
        }
      }

      // Remove note if value is not null
      if (newVal !== null) {
        state.notes[pos] = [];
      }

      // Re highlight
      highLight(state.cells, pos);

      // Re-calculate conflict
      state.cellConflict = countConflict(state.cells);

      // Re-calculate empty cell
      state.cellEmpty = countEmpty(state.cells);

      // If all cells are filled and there are no conflicts, the game is won
      if (state.cellEmpty === 0 && state.cellConflict === 0) {
        setGameState("won");
      }
    })
  );
}

/**
 * Use keyboard to move to other cell
 * @param directionMove "up" | "down" | "left" | "right"
 */
export const moveSelectedCell = (
  directionMove: "up" | "down" | "left" | "right"
) => {
  const selectedCell = useSudokuStore.getState().selectedCell;

  let newPos: Position = { col: 0, row: 0 };
  if (selectedCell !== undefined) {
    const { row, col } = {
      row: Math.floor(selectedCell / 9),
      col: selectedCell % 9,
    };
    switch (directionMove) {
      case "up":
        newPos = { col, row: row === 0 ? 8 : row - 1 };
        break;
      case "down":
        newPos = { col, row: row === 8 ? 0 : row + 1 };
        break;
      case "left":
        newPos = { col: col === 0 ? 8 : col - 1, row };
        break;
      case "right":
        newPos = { col: col === 8 ? 0 : col + 1, row };
        break;
    }
  }

  clickCell(newPos.row * 9 + newPos.col);
};

/**
 * Re-highlight all cells
 * ! Can not use in produce (immer)
 */
export function reHighLight() {
  useSudokuStore.setState(
    produce((state: SudokuState) => {
      if (state.selectedCell) {
        highLight(state.cells, state.selectedCell);
      }
    })
  );
}

/**
 * Action replay current puzzle
 */
export function actionRePlay() {
  const { puzzle } = useSudokuStore.getState();
  if (puzzle) {
    setPuzzle(puzzle);
  } else {
    console.error("No puzzle to replay!");
  }
}

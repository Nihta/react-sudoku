import produce from "immer";
import { create } from "zustand";
import { easyPuzzles } from "../data/sudokuPuzzles";
import { CellState, Notes, Position, PuzzleData } from "../types/sudokuTypes";
import {
  convertPuzzle,
  countConflict,
  countEmpty,
  getCorrectNumber,
  highLight,
  isSamePos,
} from "../utils/sudokuUtils";
import { useGameStore } from "./useGameStore";

/**
 * Pre handle action
 *
 * If game state is `won` or `paused`, return false
 */
const canDoAction = () => {
  const gameState = useGameStore.getState().gameState;
  const setGamestate = useGameStore.getState().setGamestate;
  if (gameState === "won" || gameState === "paused") {
    // console.log("Can't do action");
    if (gameState === "paused") {
      setGamestate("playing");
    }
    return false;
  }
  return true;
};

interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell: Position | null;
  cells: Array<CellState>;
  cellEmpty: number;
  cellConflict: number;
  history: [Position, CellState["value"]][];
  notes: Notes;
  noteMode: boolean;
  /**
   * Count time use for solve puzzle
   */
  time: number;
  /**
   * Only count when game state is true
   */
  incTime: () => void;
  /**
   * false: not solved
   * true: solved
   */
  setPuzzle: (puzzle: PuzzleData) => void;
  clickCell: (pos: Position) => void;
  inputCell: (newNumber: CellState["value"], ignoreUndo?: boolean) => void;
  deleteCell: (pos?: Position) => void;
  actionDelete: () => void;
  actionHint: () => void;
  actionUndo: () => void;
  actionNewGame: () => void;
  /**
   * Keep length of history is less than 1000
   */
  addHistory: (pos: Position, val: CellState["value"]) => void;
  actionNote: () => void;
  setCellVal: (
    pos: Position,
    val: CellState["value"],
    ignoreUndo?: boolean
  ) => void;
}

const useSudokuStore = create<SudokuState>()((set, get) => ({
  puzzle: undefined,
  noteMode: false,
  selectedCell: null,
  history: [],
  cells: [],
  cellEmpty: 81,
  cellConflict: 0,
  time: 0,
  notes: Array.from({ length: 81 }, () => []),
  incTime() {
    const { time } = get();
    set({ time: time + 1 });
  },
  setPuzzle: (puzzle) => {
    const { cells, cellEmpty } = convertPuzzle(puzzle);
    const setGamestate = useGameStore.getState().setGamestate;
    set({
      puzzle,
      cells,
      cellEmpty,
      cellConflict: countConflict(cells),
      history: [],
      selectedCell: null,
      time: 0,
      notes: Array.from({ length: 81 }, () => []),
      noteMode: false,
    });
    setGamestate("playing");
  },
  actionNote() {
    if (!canDoAction()) return;

    const { noteMode } = get();
    set({ noteMode: !noteMode });
  },
  clickCell: (pos: Position) => {
    if (!canDoAction()) return;

    set(
      produce((state: SudokuState) => {
        const posOld = state.selectedCell;
        // Nếu đã chọn một cell trước đó
        if (posOld) {
          // Nếu cell đang chọn là cell đã chọn trước đó thì bỏ qua
          if (isSamePos(posOld, pos)) {
            return;
          }
          // Bỏ chọn cell cũ
          state.cells[posOld.row * 9 + posOld.col].selected = false;
        }

        // Chọn cell mới
        state.selectedCell = pos;
        state.cells[pos.row * 9 + pos.col].selected = true;

        // Highlight lại
        const newCells = highLight(state.cells, pos);
        state.cells = newCells;
      })
    );
  },
  /**
   * Điền giá trị vào một cell
   *
   * KHông thêm vào history, tự động xóa note nếu giá trị nhập vào khác null
   */
  setCellVal(pos, newVal) {
    const setGamestate = useGameStore.getState().setGamestate;

    set(
      produce((state: SudokuState) => {
        const cell = state.cells[pos.row * 9 + pos.col];

        if (cell.value === newVal) {
          cell.value = null;
        } else {
          cell.value = newVal;
        }

        // Remove note if value is not null
        if (newVal !== null) {
          state.notes[pos.row * 9 + pos.col] = [];
        }

        // Re highlight
        highLight(state.cells, pos);

        // Re-calculate conflict
        state.cellConflict = countConflict(state.cells);

        // Re-calculate empty cell
        state.cellEmpty = countEmpty(state.cells);

        // If all cells are filled and there are no conflicts, the game is won
        if (state.cellEmpty === 0 && state.cellConflict === 0) {
          setGamestate("won");
        }
      })
    );
  },
  /**
   * Điền giá trị vào một cell
   */
  inputCell: (newVal, ignoreUndo) => {
    if (!canDoAction()) return;

    const { setCellVal, selectedCell: selectedPos, cells, noteMode } = get();

    // If not selected cell
    if (!selectedPos) return;

    // If selected cell is origin, can't change
    const cell = cells[selectedPos.row * 9 + selectedPos.col];
    if (cell.isOrigin) return;

    // Note mode ---------------------------------------------------------------
    set(
      produce((state: SudokuState) => {
        const noteIdx = selectedPos.row * 9 + selectedPos.col;
        const note = state.notes[noteIdx];
        if (state.noteMode && newVal) {
          if (note.includes(newVal)) {
            state.notes[noteIdx] = note.filter((n) => n !== newVal);
          } else {
            state.notes[noteIdx] = [...note, newVal];
          }
        }
      })
    );

    if (noteMode) {
      setCellVal(selectedPos, null, ignoreUndo);
    } else {
      setCellVal(selectedPos, newVal, ignoreUndo);
      // Không thêm vào history khi đang ở chế độ note
      if (!ignoreUndo) {
        get().addHistory(selectedPos, newVal);
      }
    }
  },
  /**
   * Delete value of selected cell
   */
  deleteCell: (pos?: Position) => {
    if (!canDoAction()) return;

    // Can't delete cell when not selected cell
    if (!pos) return;

    const { cells, setCellVal } = get();
    const cell = cells[pos.row * 9 + pos.col];

    // Can't delete cell origin
    if (cell.isOrigin) return;

    if (cell.value) {
      setCellVal(pos, null);
    }
  },
  actionDelete() {
    if (!canDoAction()) return;

    const { selectedCell, deleteCell } = get();
    if (selectedCell) {
      // delete all note if selected cell has note
      const noteIdx = selectedCell.row * 9 + selectedCell.col;
      const note = get().notes[noteIdx];
      if (note.length > 0) {
        set(
          produce((state: SudokuState) => {
            state.notes[noteIdx] = [];
          })
        );
      } else {
        deleteCell(selectedCell);
      }
    }
  },
  actionHint() {
    if (!canDoAction()) return;

    const { selectedCell, puzzle, cells, inputCell } = get();

    if (!selectedCell || !puzzle) return;

    const cell = cells[selectedCell.row * 9 + selectedCell.col];
    if (cell.isOrigin) return;

    const correctNumber = getCorrectNumber(puzzle, selectedCell);
    inputCell(correctNumber, true);

    set(
      produce((state: SudokuState) => {
        cells[selectedCell.row * 9 + selectedCell.col].isOrigin = true;
      })
    );
  },
  actionUndo() {
    if (!canDoAction()) return;

    const { history, clickCell, setCellVal } = get();
    if (history.length === 0) return;

    const [pos, value] = history[history.length - 1];

    // if cell has note, restore value
    const noteIdx = pos.row * 9 + pos.col;
    const note = get().notes[noteIdx];
    if (note.length > 0) {
      clickCell(pos);
      setCellVal(pos, value);
      return;
    }

    set({
      history: history.slice(0, history.length - 1),
    });

    clickCell(pos);
    setCellVal(pos, value);
  },
  addHistory(pos, val) {
    console.log("addHistory", val);
    set(
      produce((state: SudokuState) => {
        state.history.push([pos, val]);
        if (state.history.length > 1000) {
          state.history.shift();
        }
      })
    );
    console.log(JSON.stringify(get().history));
    console.log(get().history.length);
  },
  actionNewGame() {
    const { setPuzzle } = get();
    const puzzle = easyPuzzles[Math.floor(Math.random() * easyPuzzles.length)];
    setPuzzle(puzzle);
  },
}));

/**
 * Use keyboard to move to other cell
 * @param directionMove Hướng di chuyển (up, down, left, right)
 */
export const moveSelectedCell = (
  directionMove: "up" | "down" | "left" | "right"
) => {
  const selectedCell = useSudokuStore.getState().selectedCell;

  let newPos: Position = { col: 0, row: 0 };
  if (selectedCell) {
    const { row, col } = selectedCell;
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

  useSudokuStore.getState().clickCell(newPos);
};

export default useSudokuStore;

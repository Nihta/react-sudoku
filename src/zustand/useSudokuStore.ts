import produce from "immer";
import { create } from "zustand";
import { CellState, Notes, Position, PuzzleData } from "../types/sudokuTypes";
import {
  convertPuzzle,
  countConflict,
  countEmpty,
  getCorrectNumber,
  getPuzzle,
  highLight,
} from "../utils/sudokuUtils";
import { useGameStore } from "./useGameStore";

/**
 * Pre handle action
 *
 * If game state is `won` or `paused`, return false
 */
const canDoAction = () => {
  const gameState = useGameStore.getState().gameState;
  const setGameState = useGameStore.getState().setGameState;
  if (gameState === "won" || gameState === "paused") {
    // console.log("Can't do action");
    if (gameState === "paused") {
      setGameState("playing");
    }
    return false;
  }
  return true;
};
/**
 * Check if cell is editable
 * @returns false if cell is not editable, cell state if cell is editable
 */
const isEditable = (
  cells: SudokuState["cells"],
  selectedCell: SudokuState["selectedCell"]
) => {
  if (selectedCell === undefined) return false;

  const cell = cells[selectedCell];

  if (cell.isOrigin) return false;

  return cell;
};

interface SudokuState {
  puzzle?: PuzzleData;
  selectedCell?: number;
  cells: Array<CellState>;
  cellEmpty: number;
  cellConflict: number;
  history: {
    cells: SudokuState["cells"];
    notes: SudokuState["notes"];
    // * need same name (selectedCell)
    selectedCell: SudokuState["selectedCell"];
  }[];
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
  clickCell: (pos: number) => void;
  inputCell: (newVal: CellState["value"], ignoreUndo?: boolean) => void;
  deleteCell: (pos: number) => void;
  actionDelete: () => void;
  actionHint: () => void;
  actionUndo: () => void;
  actionNewGame: () => void;
  /**
   * Keep length of history is less than 100
   */
  addHistory: () => void;
  actionNote: () => void;
  setCellVal: (
    pos: number,
    val: CellState["value"],
    ignoreUndo?: boolean
  ) => void;
}

const useSudokuStore = create<SudokuState>()((set, get) => ({
  puzzle: undefined,
  noteMode: false,
  selectedCell: undefined,
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
    const setGamestate = useGameStore.getState().setGameState;
    set({
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
    setGamestate("playing");
  },
  actionNote() {
    if (!canDoAction()) return;

    const { noteMode } = get();
    set({ noteMode: !noteMode });
  },
  clickCell: (pos) => {
    if (!canDoAction()) return;

    set(
      produce((state: SudokuState) => {
        const selectedCell = state.selectedCell;
        // Nếu đã chọn một cell trước đó
        if (selectedCell !== undefined) {
          // Nếu cell đang chọn là cell đã chọn trước đó thì bỏ qua
          if (selectedCell === pos) {
            return;
          }
          // Bỏ chọn cell cũ
          state.cells[selectedCell].selected = false;
        }

        // Chọn cell mới
        state.selectedCell = pos;
        state.cells[pos].selected = true;

        // Highlight lại
        state.cells = highLight(state.cells, pos);
      })
    );
  },
  /**
   * Điền giá trị vào một cell
   *
   * Không thêm vào history, tự động xóa note nếu giá trị nhập vào khác null
   */
  setCellVal(pos, newVal) {
    const setGameState = useGameStore.getState().setGameState;

    set(
      produce((state: SudokuState) => {
        const cell = state.cells[pos];

        if (cell.value === newVal) {
          cell.value = null;
        } else {
          cell.value = newVal;
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
  },
  /**
   * Điền giá trị vào một cell
   */
  inputCell: (newVal, ignoreUndo) => {
    if (!canDoAction()) return;

    const {
      setCellVal,
      selectedCell: currPos,
      cells,
      noteMode,
      addHistory,
    } = get();

    addHistory();

    // If not selected cell
    if (currPos === undefined) return;

    // If selected cell is origin, can't change
    const cell = cells[currPos];
    if (cell.isOrigin) return;

    // Note mode ---------------------------------------------------------------
    set(
      produce((state: SudokuState) => {
        const note = state.notes[currPos];
        if (state.noteMode && newVal) {
          if (note.includes(newVal)) {
            state.notes[currPos] = note.filter((n) => n !== newVal);
          } else {
            state.notes[currPos] = [...note, newVal];
          }
        }
      })
    );

    if (noteMode) {
      setCellVal(currPos, null, ignoreUndo);
    } else {
      setCellVal(currPos, newVal, ignoreUndo);
    }
  },
  /**
   * Delete value of selected cell
   */
  deleteCell: (pos) => {
    const { setCellVal } = get();
    setCellVal(pos, null);
  },
  actionDelete() {
    if (!canDoAction()) return;
    const { selectedCell, deleteCell, noteMode, cells, addHistory } = get();

    if (selectedCell === undefined) return;

    const cell = isEditable(cells, selectedCell);
    if (!cell) return;

    addHistory();

    // If it has note, delete note
    if (noteMode) {
      set(
        produce((state: SudokuState) => {
          state.notes[selectedCell!] = [];
        })
      );
      return;
    }

    deleteCell(selectedCell!);
  },
  actionHint() {
    if (!canDoAction()) return;

    const { selectedCell, puzzle, cells, inputCell } = get();

    if (selectedCell === undefined || !puzzle) return;

    const cell = cells[selectedCell];
    if (cell.isOrigin) return;

    const correctNumber = getCorrectNumber(puzzle, selectedCell);
    inputCell(correctNumber, true);

    set(
      produce((state: SudokuState) => {
        state.cells[selectedCell].isOrigin = true;
      })
    );
  },
  actionUndo() {
    if (!canDoAction()) return;
    const { history } = get();
    if (history.length === 0) return;
    set({
      ...history[history.length - 1],
      history: history.slice(0, history.length - 1),
    });
  },
  addHistory() {
    set(
      produce((state: SudokuState) => {
        state.history.push({
          cells: state.cells,
          notes: state.notes,
          selectedCell: state.selectedCell,
        });
        if (state.history.length > 100) {
          state.history.shift();
        }
      })
    );
  },
  actionNewGame() {
    const { setPuzzle } = get();
    const puzzle = getPuzzle();
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

  useSudokuStore.getState().clickCell(newPos.row * 9 + newPos.col);
};

export default useSudokuStore;

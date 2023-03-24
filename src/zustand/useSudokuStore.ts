import produce from "immer";
import { create } from "zustand";
import { easyPuzzles } from "../data/sudokuPuzzles";
import { CellState, Notes, Position, PuzzleData } from "../types/sudokuTypes";
import {
  convertPuzzle,
  countConflict,
  getCorrectNumber,
  highLight,
  isSamePos,
} from "../utils/sudokuUtils";

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
  gameState: boolean;
  setPuzzle: (puzzle: PuzzleData) => void;
  clickCell: (pos: Position) => void;
  inputCell: (newNumber: CellState["value"], ignoreUndo?: boolean) => void;
  deleteCell: (pos?: Position) => void;
  actionDelete: () => void;
  actionHint: () => void;
  actionUndo: () => void;
  actionNewGame: () => void;
  /**
   * Keep length of history is less than 100
   */
  setHistory: (pos: Position, val: CellState["value"]) => void;
  actionNote: () => void;
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
    const { time, gameState } = get();
    if (!gameState) {
      set({ time: time + 1 });
    }
  },
  gameState: false,
  setPuzzle: (puzzle) => {
    const { cells, cellEmpty } = convertPuzzle(puzzle);
    set({
      puzzle,
      cells,
      cellEmpty,
      cellConflict: countConflict(cells),
      gameState: false,
      history: [],
      selectedCell: null,
      time: 0,
      notes: Array.from({ length: 81 }, () => []),
      noteMode: false,
    });
  },
  actionNote() {
    const { noteMode } = get();
    set({ noteMode: !noteMode });
  },
  clickCell: (pos: Position) => {
    set(
      produce((state: SudokuState) => {
        // If game state is win
        if (state.gameState) {
          return;
        }

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
   */
  inputCell: (newVal, ignoreUndo) => {
    set(
      produce((state: SudokuState) => {
        // If game state is win
        if (state.gameState) return;

        // If not selected cell
        const selectedPos = state.selectedCell;
        if (!selectedPos) return;

        const cellSelected = state.cells[selectedPos.row * 9 + selectedPos.col];

        // Nếu đó là cell gốc - không thể sửa
        if (cellSelected.isOrigin) return;

        // Note mode
        // todo newVal tại sao lại có thể là null
        if (state.noteMode && newVal) {
          const note = state.notes[selectedPos.row * 9 + selectedPos.col];
          if (note.includes(newVal)) {
            state.notes[selectedPos.row * 9 + selectedPos.col] = note.filter(
              (n) => n !== newVal
            );
          } else {
            state.notes[selectedPos.row * 9 + selectedPos.col] = [
              ...note,
              newVal,
            ];
          }
          return;
        } else {
          state.notes[selectedPos.row * 9 + selectedPos.col] = [];
        }

        // Cập nhật giá trị của cell
        const oldCellVal = cellSelected.value;

        // If new number is same old number, delete cell
        if (oldCellVal && newVal && oldCellVal === newVal) {
          cellSelected.value = null;
          state.cellEmpty++;
          if (!ignoreUndo) {
            state.setHistory(selectedPos, null);
          }
        } else {
          cellSelected.value = newVal;
          if (!ignoreUndo) {
            state.history.push([selectedPos, newVal]);
            state.setHistory(selectedPos, newVal);
          }
        }

        // If old number is null, cell empty decrease 1
        if (!oldCellVal) {
          state.cellEmpty--;
        }

        // HighLight lại
        highLight(state.cells, selectedPos);
        // Tính lại số lượng conflict
        state.cellConflict = countConflict(state.cells);

        // If all cells are filled and there are no conflicts, the game is won
        if (state.cellEmpty === 0 && state.cellConflict === 0) {
          state.gameState = true;
        }
      })
    );
  },
  /**
   * Delete value of selected cell
   */
  deleteCell: (pos?: Position) => {
    set(
      produce((state: SudokuState) => {
        // Can't delete cell when game win
        if (state.gameState) return;

        // Can't delete cell when not selected cell
        const posSelected = pos ? pos : state.selectedCell;
        if (!posSelected) return;

        // Can't delete cell origin
        const cell = state.cells[posSelected.row * 9 + posSelected.col];
        if (cell.isOrigin) return;

        if (cell.value) {
          cell.value = null;
          state.cellEmpty++;
        }
      })
    );
  },
  actionDelete() {
    const { selectedCell, deleteCell } = useSudokuStore.getState();
    if (selectedCell) {
      deleteCell(selectedCell);
    }
  },
  actionHint() {
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
    const { history, clickCell, inputCell } = get();
    if (history.length === 0) return;

    const [pos, value] = history[history.length - 1];
    set({
      history: history.slice(0, history.length - 1),
    });

    clickCell(pos);
    // ignore save history (undo)
    inputCell(value, true);
  },
  setHistory(pos, val) {
    set(
      produce((state: SudokuState) => {
        state.history.push([pos, val]);
        if (state.history.length > 100) {
          state.history.shift();
        }
      })
    );
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

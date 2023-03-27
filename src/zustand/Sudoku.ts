import useSudokuStore, { canDoAction, SudokuState } from "./useSudokuStore";
import {
  convertPuzzle,
  countConflict,
  countEmpty,
  getCorrectNumber,
  getPuzzle,
  highLight,
} from "../utils/sudokuUtils";
import produce from "immer";
import { useGameStore } from "./useGameStore";
import { CellState, Position, PuzzleData } from "../types/sudokuTypes";

/**
 * Luu trang thai hien tai vao store:
 * - cells
 * - notes
 * - selectedCell
 */
export const addHistory = () => {
  useSudokuStore.setState(
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
};

/**
 * Gọi để tăng thời gian chơi lên 1 giây
 */
export const incTime = () => {
  const { time } = useSudokuStore.getState();
  useSudokuStore.setState({
    time: time + 1,
  });
};

/**
 * bat dau tro choi moi
 */
export const actionNewGame = () => {
  const puzzle = getPuzzle();
  setPuzzle(puzzle);
};

export const actionHint = () => {
  if (!canDoAction()) return;

  const { selectedCell, puzzle, cells } = useSudokuStore.getState();

  if (selectedCell === undefined || !puzzle) return;

  const cell = cells[selectedCell];
  if (cell.isOrigin) return;

  const correctNumber = getCorrectNumber(puzzle, selectedCell);
  inputCell(correctNumber);

  useSudokuStore.setState(
    produce((state: SudokuState) => {
      state.cells[selectedCell].isOrigin = true;
    })
  );
};

/**
 * Delete value of selected cell
 */
export const deleteCell = (pos: number) => {
  setCellVal(pos, null);
};

export const actionDelete = () => {
  if (!canDoAction()) return;

  const { selectedCell, noteMode, cells } = useSudokuStore.getState();

  if (selectedCell === undefined) return;
  const cell = cells[selectedCell];
  if (cell.isOrigin) return;

  addHistory();

  // If it has note, delete note
  if (noteMode) {
    useSudokuStore.setState(
      produce((state: SudokuState) => {
        state.notes[selectedCell!] = [];
      })
    );
    return;
  }

  deleteCell(selectedCell!);
};

export const actionUndo = () => {
  if (!canDoAction()) return;
  const { history } = useSudokuStore.getState();
  if (history.length === 0) return;
  // xoa lich su trang thai sau cung va day vao state
  useSudokuStore.setState({
    ...history[history.length - 1],
    history: history.slice(0, history.length - 1),
  });
};

/**
 * Bat tat che do ghi chu
 */
export const actionNote = () => {
  if (!canDoAction()) return;
  const { noteMode } = useSudokuStore.getState();
  useSudokuStore.setState({ noteMode: !noteMode });
};

/**
 * Ham khoi tao cua tro choi
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
  if (!canDoAction()) return;

  useSudokuStore.setState(
    produce((state: SudokuState) => {
      const currCell = state.selectedCell;

      // bo chon cell cu
      if (currCell) {
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

  const { selectedCell: currPos, cells, noteMode } = useSudokuStore.getState();

  // If not selected cell
  if (currPos === undefined) return;

  // If selected cell is origin, can't change
  const cell = cells[currPos];
  if (cell.isOrigin) return;

  // Truoc khi thay doi trang thai thi can luu lai
  addHistory();

  if (noteMode) {
    // ham nay tu dong set cell val = null
    setNoteVal(currPos, newVal);
  } else {
    // ham nay tu dong xoa note new val != null
    setCellVal(currPos, newVal);
  }
}

export function setNoteVal(pos: number, val: CellState["value"]) {
  useSudokuStore.setState(
    produce((state: SudokuState) => {
      const note = state.notes[pos];
      if (state.noteMode && val) {
        if (note.includes(val)) {
          state.notes[pos] = note.filter((n) => n !== val);
        } else {
          state.notes[pos] = [...note, val];
        }
      }
    })
  );
  setCellVal(pos, null);
}

export function setNote(pos: number, vals: number[]) {
  useSudokuStore.setState(
    produce((state: SudokuState) => {
      state.notes[pos] = vals;
    })
  );
  setCellVal(pos, null);
}

/**
 * Điền giá trị vào một cell
 *
 * Không thêm vào history, tự động xóa note nếu giá trị nhập vào khác null (boi vi khi nhap note thi lai set val = null :v)
 */
export function setCellVal(
  pos: number,
  newVal: CellState["value"],
  ignoreUndo?: boolean,
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
      // todo change to sub
      if (state.cellEmpty === 0 && state.cellConflict === 0) {
        setGameState("won");
      }
    })
  );
}

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

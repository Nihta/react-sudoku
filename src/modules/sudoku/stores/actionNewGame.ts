import { dataPuzzles } from "../../../data/sudokuPuzzles";
import { Difficulty, PuzzleData } from "../sudokuTypes.ts";
import { getRandomElementFromArray } from "../../../utils/arrayUtils";
import { countConflict, decodeSudokuPuzzle } from "../../../utils/sudoku";
import { shuffleSudoku } from "../utils/shuffleSudoku.ts";
import { convertPuzzle } from "../utils";
import { useBoardStore } from "./useBoard";
import { useGameStore } from "./useGame";
import { useUndoStore } from "./useUndo";

export const initGame = (puzzle: PuzzleData, level: Difficulty) => {
  const { cells, cellEmpty } = convertPuzzle(puzzle);

  useBoardStore.setState({
    puzzle,
    cells,
    cellEmpty,
    cellConflict: countConflict(cells),
    notes: Array.from({ length: 81 }, () => []),
    highlightBlocks: [],
    highlightRows: [],
    highlightCols: [],
    mode: "normal",
    hintActions: undefined,
    selectedCell: undefined,
    difficulty: level,
  });

  useGameStore.setState({ state: "playing", time: 0 });
  useUndoStore.getState().resetHistory();
};

export const actionNewGame = (level: Difficulty = "easy") => {
  const puzzle = decodeSudokuPuzzle(
    import.meta.env.DEV
      ? getRandomElementFromArray(dataPuzzles[level])
      : shuffleSudoku(getRandomElementFromArray(dataPuzzles[level]))
  );

  initGame(puzzle, level);
};

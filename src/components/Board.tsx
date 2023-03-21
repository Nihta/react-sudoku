import { useCallback, useEffect } from "react";
import { easyPuzzles } from "../data/sudokuPuzzles";
import useKeyDown from "../hooks/useKeyDown";
import useSudokuStore, { moveSelectedCell } from "../zustand/useSudokuStore";

import Row from "./Row";

function Board() {
  const { deleteCell, inputCell, setPuzzle } = useSudokuStore((state) => state);

  useEffect(() => {
    setPuzzle(easyPuzzles[0]);
  }, [setPuzzle, easyPuzzles]);

  useKeyDown((e) => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft":
        e.preventDefault();
        moveSelectedCell("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        moveSelectedCell("right");
        break;
      case "ArrowUp":
        e.preventDefault();
        moveSelectedCell("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        moveSelectedCell("down");
        break;
      case "Backspace":
      case "Delete":
        deleteCell(undefined);
        break;
      default:
        if (1 <= +key && +key <= 9) {
          inputCell(parseInt(key, 10));
          break;
        }
    }
  });

  return (
    <div className="board">
      <div className="tbody">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
          <Row key={val} row={val} />
        ))}
      </div>
    </div>
  );
}

export default Board;


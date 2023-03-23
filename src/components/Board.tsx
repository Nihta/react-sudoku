import React, { useCallback, useEffect } from "react";
import { easyPuzzles } from "../data/sudokuPuzzles";
import useKeyDown from "../hooks/useKeyDown";
import { getCellFromPos } from "../utils";
import useSudokuStore, { moveSelectedCell } from "../zustand/useSudokuStore";

import "./Board.scss";
import Cell from "./Cell";

function Board2() {
  const { deleteCell, inputCell, setPuzzle, cells } = useSudokuStore(
    (state) => state
  );

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
    <div className="sudoku-board">
      <div className="sudoku-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <React.Fragment key={i}>
            {Array.from({ length: 9 }, (_, j) => (
              <Cell row={i} col={j} key={`${i}${j}`} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Board2;

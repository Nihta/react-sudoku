import { useCallback, useEffect } from "react";
import useKeyDown from "../hooks/useKeyDown";
import useSudokuStore, { moveSelectedCell } from "../zustand/useSudokuStore";

import Row from "./Row";

const UN_SOLVE = [
  ["5", "4", "1", "6", "8", "2", "7", "3", "9"],
  ["3", "8", "7", "4", "9", "5", "2", "1", "6"],
  ["9", "2", "6", "1", "3", "7", "4", "5", "8"],

  ["2", "1", "4", "7", "6", "8", "3", "9", "5"],
  ["7", "6", "3", "5", "4", "9", "8", "2", "1"],
  ["8", "5", "9", "2", "1", "3", "6", "4", "7"],

  ["6", "3", "2", "8", "5", "1", "9", "7", "4"],
  ["4", "9", "5", "3", "7", "6", "1", "8", "2"],
  ["1", "7", null, "9", null, "4", "5", "6", "3"],
];

function Board() {
  const { deleteCell, inputCell, setUnSolve } = useSudokuStore(
    (state) => state
  );

  useEffect(() => {
    setUnSolve(UN_SOLVE);
  }, [setUnSolve]);

  const handlerKeyDown = useCallback((e: any) => {
    const { key } = e;

    // console.log(`Press ${key}`);

    switch (key) {
      case "ArrowLeft":
        moveSelectedCell("left");
        break;
      case "ArrowRight":
        moveSelectedCell("right");
        break;
      case "ArrowUp":
        moveSelectedCell("up");
        break;
      case "ArrowDown":
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
  }, []);

  useKeyDown(handlerKeyDown);

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

import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import Row from "./Row";
import useKeyDown from "../hooks/useKeyDown";
import {
  deleteCell,
  inputCell,
  moveSelectedCell,
  setUnSolve,
} from "../sudokuSlice";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUnSolve(UN_SOLVE));
  }, [dispatch]);

  const handlerKeyDown = useCallback(
    (e) => {
      const { key } = e;

      // console.log(`Press ${key}`);

      switch (key) {
        case "ArrowLeft":
          dispatch(moveSelectedCell("left"));
          break;
        case "ArrowRight":
          dispatch(moveSelectedCell("right"));
          break;
        case "ArrowUp":
          dispatch(moveSelectedCell("up"));
          break;
        case "ArrowDown":
          dispatch(moveSelectedCell("down"));
          break;
        case "Backspace":
        case "Delete":
          dispatch(deleteCell(null));
          break;
        default:
          if (1 <= +key && +key <= 9) {
            dispatch(inputCell({ number: parseInt(key, 10) }));
            break;
          }
      }
    },
    [dispatch]
  );

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

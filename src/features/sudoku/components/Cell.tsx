import classNames from "classnames";
import { useDispatch } from "react-redux";

import { useCell } from "../hooks/sudokuHooks";
import { clickCell } from "../sudokuSlice";

function Note() {
  return (
    <div className="notes">
      <div className="notes-item">1</div>
      <div className="notes-item">2</div>
      <div className="notes-item">3</div>
      <div className="notes-item">4</div>
      <div className="notes-item">5</div>
      <div className="notes-item">6</div>
      <div className="notes-item">7</div>
      <div className="notes-item">8</div>
      <div className="notes-item">9</div>
    </div>
  );
}

type CellProps = {
  row: number;
  col: number;
};

function Cell(prop: CellProps) {
  const { row, col } = prop;

  const dispatch = useDispatch();
  const cell = useCell({ row, col });

  if (!cell) {
    return null;
  }

  const isNote = false;

  const cellOnClick = () => {
    dispatch(clickCell({ row, col }));
  };

  const className = classNames("sudoku-col", {
    incorrect: cell.status === "conflict",
    selected: cell.selected,
    highlight: cell.status === "high-light",
    "highlight-number": cell.status === "high-light-number",
    "user-type": !cell.isOrigin,
    origin: cell.isOrigin,
  });

  return (
    <>
      <div className={className} onClick={cellOnClick}>
        {isNote ? (
          <Note />
        ) : (
          <span className="cell-value">{cell.value ? cell.value : ""}</span>
        )}
      </div>
    </>
  );
}

export default Cell;

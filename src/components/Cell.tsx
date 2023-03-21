import classNames from "classnames";
import { useCell } from "../hooks/sudokuHooks";
import useSudokuStore from "../zustand/useSudokuStore";

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

  const clickCell = useSudokuStore((state) => state.clickCell);

  const cell = useCell({ row, col });

  if (!cell) {
    return null;
  }

  const isNote = false;

  const cellOnClick = () => {
    clickCell({ row, col });
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

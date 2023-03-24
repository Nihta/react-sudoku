import classNames from "classnames";
import { useCell, useCellNote } from "../hooks/sudokuHooks";
import useSudokuStore from "../zustand/useSudokuStore";

function Note({ values }: { values: number[] }) {
  return (
    <div className="notes">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => {
        return <div className="notes-item">{values.includes(i) ? i : ""}</div>;
      })}
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
  const note = useCellNote({ row, col });

  if (!cell) {
    return null;
  }

  const isHasNote = note.length > 0;

  const cellOnClick = () => {
    clickCell({ row, col });
  };

  const className = classNames("sudoku-cell", {
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
        {isHasNote ? (
          <Note values={note} />
        ) : (
          <div className="sudoku-cell__value">
            {cell.value ? cell.value : ""}
          </div>
        )}
      </div>
    </>
  );
}

export default Cell;

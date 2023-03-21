import useSudokuStore from "../zustand/useSudokuStore";
import "./Numpad.scss";

type NumpadProps = {};

function Numpad(props: NumpadProps) {
  const inputCell = useSudokuStore((st) => st.inputCell);

  return (
    <div className="sudoku-numpad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          type="button"
          key={n}
          className="numpad-button"
          aria-label="number"
          onClick={() => inputCell(n)}
        >
          <span className="numpad">{n}</span>
        </button>
      ))}
    </div>
  );
}

export default Numpad;

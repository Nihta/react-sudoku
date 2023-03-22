import useSudokuStore from "../zustand/useSudokuStore";
import "./Numpad.scss";

type NumpadProps = {};

function Numpad(props: NumpadProps) {
  const inputCell = useSudokuStore((st) => st.inputCell);

  return (
    <div className="numpad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <div key={n} className="numpad-item" onClick={() => inputCell(n)}>
          <span>{n}</span>
        </div>
      ))}
    </div>
  );
}

export default Numpad;

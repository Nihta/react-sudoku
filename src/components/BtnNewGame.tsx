import useSudokuStore from "../zustand/useSudokuStore";
import Button from "./base/Button";
import {actionNewGame} from "../zustand/Sudoku";

export default function BtnNewGame() {

  return (
    <Button
      type="button"
      label="New game"
      onClick={actionNewGame}
      title="New game"
    />
  );
}

import useSudokuStore from "../zustand/useSudokuStore";
import Button from "./base/Button";

export default function BtnNewGame() {
  const actionNewGame = useSudokuStore((state) => state.actionNewGame);

  return (
    <Button
      type="button"
      label="Trò chơi mới"
      onClick={actionNewGame}
      title="Trò chơi mới"
    />
  );
}

import styled from "styled-components";
import { handleNote, trySolve } from "../utils/sudokuRules";
import { useGameStore } from "../zustand/useGameStore";
import Pressable from "./base/Pressable";
import { setPuzzle } from "../zustand/Sudoku";
import { decodeSudokuPuzzle } from "../utils/sudoku";

export default function Dev() {
  const toggleSuperHighLight = useGameStore((st) => st.toggleSuperHighLight);
  const supperHighLight = useGameStore((st) => st.supperHighLight);

  const setPuzTest = () => {
    const puzzle = decodeSudokuPuzzle(
      "8G1F9BC45CDIAHEGBF2E6CD7HIAAC25FHDGI5IHD73AF27FD9B15CHD27HE69A3IAEBCD6HGFH371IB5D"
    );
    setPuzzle(puzzle);
  };

  const onClick = async () => {
    let flag = false;
    do {
      flag = trySolve();
      await new Promise((r) => setTimeout(r, 100));
    } while (flag);
  };

  return (
    <div>
      <Item onClick={onClick}>Try to solve</Item>
      <Item onClick={toggleSuperHighLight}>{`Super high light: ${
        supperHighLight ? "ON" : "OFF"
      }`}</Item>
      <Item onClick={setPuzTest}>Set puz test</Item>
      <Item onClick={handleNote}>Handle note</Item>
    </div>
  );
}

const Item = styled(Pressable)`
  padding: 10px;
  margin: 10px;
  text-align: center;
  border-color: var(--color-primary);
  border-width: 2px;
  border-style: solid;
  color: var(--color-primary);
  font-weight: 600;
`;

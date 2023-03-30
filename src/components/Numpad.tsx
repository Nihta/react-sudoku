import styled from "styled-components";

import Pressable from "./base/Pressable";
import { inputCell } from "../zustand/Sudoku";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Numpad() {
  return (
    <Wrapper>
      {arr.map((n) => (
        <Item key={n} onClick={() => inputCell(n)}>
          {n}
        </Item>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  margin: 5px 0;
  grid-template-columns: repeat(9, 1fr);

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 2%;
  }
`;

const Item = styled(Pressable)`
  font-size: 36px;
  color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 767px) {
    background: transparent;
    &:hover {
      background: transparent;
    }
    &:active {
      background: #d2dae7;
    }
  }
`;

export default Numpad;

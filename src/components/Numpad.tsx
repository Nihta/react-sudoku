import styled from "styled-components";

import useSudokuStore from "../zustand/useSudokuStore";
import Pressable from "./base/Pressable";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Numpad() {
  const inputCell = useSudokuStore((st) => st.inputCell);

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
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-template-rows: repeat(3, 32%);
  grid-gap: 2%;

  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: 100%;
    grid-gap: 0;
    margin: 5px 0;
  }
`;

const Item = styled(Pressable)`
  font-size: 36px;
  color: var(--color-primary);
  text-align: center;
  padding: 18% 0;

  @media screen and (max-width: 767px) {
    padding: 0;
    background: transparent;
    &:hover {
      background: transparent;
    }
    &:active {
      background: #d2dae7;
    };
  }
`;

export default Numpad;

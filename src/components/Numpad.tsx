import styled from "styled-components";
import { BREAKPOINTS } from "../constants.ts";

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
  margin: 5px 0;

  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: 100%;
  grid-gap: 0;

  @media ${BREAKPOINTS.smAndLarger} {
    grid-template-columns: repeat(3, 32%);
    grid-template-rows: repeat(3, 32%);
    grid-gap: 2%;
  }
`;

const Item = styled(Pressable)`
  font-size: 32px;
  color: var(--color-primary);
  text-align: center;

  @media ${BREAKPOINTS.smAndSmaller} {
    background: transparent;
    &:hover {
      background: transparent;
    }
    &:active {
      background: #d2dae7;
    }
  }

  @media ${BREAKPOINTS.smAndLarger} {
    padding: 18% 0;
  }
`;

export default Numpad;

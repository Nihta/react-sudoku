import styled from "styled-components";
import { BREAKPOINTS } from "../constants";

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

  @media ${BREAKPOINTS.mdAndLarger} {
    grid-template-columns: repeat(3, 32%);
    grid-template-rows: repeat(3, 32%);
    grid-gap: 2%;
    margin: 0;
  }
`;

const Item = styled(Pressable)`
  font-size: 40px;
  color: var(--color-primary);
  text-align: center;

  @media ${BREAKPOINTS.mdAndSmaller} {
    background: transparent;
    &:hover {
      background: transparent;
    }
    &:active {
      background: #d2dae7;
    }
  }

  @media ${BREAKPOINTS.smAndLarger} {
    padding: 12% 0;
  }

  @media ${BREAKPOINTS.lgAndLarger} {
    padding: 7% 0;
  }
`;

export default Numpad;

import styled from "styled-components";
import { BoardLines } from "./Borad";
import { useBoardStore } from "../stores/useBoard";
import { Cell2 } from "./Cell2";

export const Sudoku2 = () => {
  const cells = useBoardStore((state) => state.cells);

  return (
    <div className="">
      <Container>
        <Wrapper>
          <Grid3x3>
            {cells.map((v, i) => (
              <Cell2 key={i} value={v.value ?? 0} />
            ))}
          </Grid3x3>

          <BoardLines
            line={8}
            lineSize={1}
            backgroundColor="rgb(191, 198, 212)"
          />
          <BoardLines line={2} lineSize={2} backgroundColor="rgb(52, 72, 97)" />

          <Overlay />

          <Absolute>
            <Grid3x3>
              {cells.map((v, i) => (
                <Cell2
                  key={i}
                  value={v.value ?? 0}
                  overlay={v.value !== 0 && Math.random() > 0.5}
                />
              ))}
            </Grid3x3>
          </Absolute>

          {/* <BoardLines line={8} lineSize={1} backgroundColor="red" /> */}
          <BoardLines line={2} lineSize={2} backgroundColor="red" />

          <Absolute>
            <Grid3x3>
              <MagicBlock>
                <MagicBlockBorder />
              </MagicBlock>
            </Grid3x3>
          </Absolute>
        </Wrapper>
      </Container>
    </div>
  );
};

const Container = styled.div`
  position: relative;
  width: 500px;
  aspect-ratio: 1 / 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
`;

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgb(52, 72, 97);
`;

const Grid3x3 = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 1px;
`;

const MagicBlock = styled.div`
  // row 5
  /* grid-row: 5;
  grid-column: 1 / 10; */

  // col 5
  grid-row: 1 / 10;
  grid-column: 5;

  // block 5
  grid-row: 4 / 7;
  grid-column: 4 / 7;

  position: relative;
`;

const MagicBlockBorder = styled.div`
  position: absolute;
  inset: -3px;
  border: 4px solid rgb(50, 90, 175);
`;

const Absolute = styled.div`
  position: absolute;
  inset: 0;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

import styled from "styled-components";
import { useBoardStore } from "../stores/useBoard";
import { Cell2 } from "./Cell2";

const cell2 =
  "000005000000000000000000001230000004560000000000000000000000000000000000000000798";
const VALUES2 = cell2.split("").map(Number);

export const Sudoku3 = () => {
  const cells = useBoardStore((state) => state.cells);
  const mode = useBoardStore((state) => state.mode);
  const HINT_MODE = mode === "hint";

  // hint
  // highlightBlocks: number[];
  // highlightRows: number[];
  // highlightCols: number[];
  // hintActions?: HintActions;

  return (
    <div className="" style={{ margin: "50px" }}>
      <Container>
        <Wrapper>
          <Inner>
            <Grid>
              {cells.map((v, i) => (
                <Cell2 key={i} value={v.value ?? 0} />
              ))}
            </Grid>
          </Inner>
          {HINT_MODE && (
            <>
              <CellOverlay />
              <Grid81>
                {VALUES2.map((_, i) => (
                  <Cell2
                    key={i}
                    value={VALUES2[i]}
                    transparent={VALUES2[i] === 0}
                  />
                ))}
              </Grid81>
            </>
          )}

          <Grid3x3>
            <Block />
            <Block />
            <Block />
            <Block />
            <Block />
            <Block />
            <Block />
            <Block />
            <Block />
          </Grid3x3>
          <Block />
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
  /* border: 20px solid rgb(52, 72, 97); */
`;

const Inner = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Grid = styled.div`
  /* width: calc(100% + 1px); */
  /* height: calc(100% + 1px); */
  width: 100%;
  height: 100%;
  touch-action: none;
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: repeat(9, 1fr);

  background-color: rgb(191, 198, 212);
  gap: 1px;
`;

const Grid81 = styled(Grid)`
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
`;

const CellOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Grid3x3 = styled.div`
  /* define css val */
  --game-border-color: rgb(52, 72, 97);
  --game-border-color: rgb(16, 21, 29);
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--game-border-color);
`;

const Block = styled.div`
  border: 1px solid var(--game-border-color);
`;

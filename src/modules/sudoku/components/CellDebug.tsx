import styled from "styled-components";
import { Cell, CellState } from "./Cell";

export const CellDebug = () => {
  return (
    <div className="">
      <Container>
        <CellContainer>
          <Cell
            col={0}
            row={0}
            borderRight
            borderBottom
            borderLeft
            borderTop
            cellState={{
              isOrigin: true,
              selected: false,
              status: "normal",
              value: 1,
            }}
            onClick={() => {}}
          />
        </CellContainer>
        <CellContainer>
          <Cell
            col={0}
            row={0}
            borderRight
            borderBottom
            borderLeft
            borderTop
            cellState={{
              isOrigin: true,
              selected: false,
              status: "high-light",
              value: 2,
            }}
            onClick={() => {}}
          />
        </CellContainer>

        <CellContainer>
          <Cell
            col={0}
            row={0}
            borderRight
            borderBottom
            borderLeft
            borderTop
            cellState={{
              isOrigin: true,
              selected: false,
              status: "high-light-number",
              value: 3,
            }}
            onClick={() => {}}
          />
        </CellContainer>

        <CellContainer>
          <Cell
            col={0}
            row={0}
            borderRight
            borderBottom
            borderLeft
            borderTop
            cellState={{
              isOrigin: true,
              selected: true,
              status: "normal",
              value: 4,
            }}
            onClick={() => {}}
          />
        </CellContainer>
      </Container>

      <div className="">
        <h2>Conflict</h2>

        <Container>
          <CellDemo
            cellState={{
              isOrigin: true,
              selected: false,
              status: "normal",
              isConflict: true,
              value: 1,
            }}
          />
          <CellDemo
            cellState={{
              isOrigin: false,
              selected: false,
              status: "normal",
              isConflict: true,
              value: 2,
            }}
          />
          <CellDemo
            cellState={{
              isOrigin: true,
              selected: true,
              status: "normal",
              isConflict: true,
              value: 1,
            }}
          />
          <CellDemo
            cellState={{
              isOrigin: false,
              selected: true,
              status: "normal",
              isConflict: true,
              value: 2,
            }}
          />
        </Container>
      </div>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px;
`;

const CellContainer = styled.div`
  width: 56px;
  height: 56px;
`;

{
  /* <CellContainer>
<Cell
  col={0}
  row={0}
  borderRight
  borderBottom
  borderLeft
  borderTop
  cellState={{
    isOrigin: true,
    selected: true,
    status: "normal",
    value: 4,
  }}
  onClick={() => {}}
/>
</CellContainer> */
}
type CellDemoProps = {
  cellState: CellState;
};
const CellDemo = (props: CellDemoProps) => {
  return (
    <CellContainer>
      <Cell
        col={0}
        row={0}
        borderRight
        borderBottom
        borderLeft
        borderTop
        cellState={props.cellState}
        onClick={() => {}}
      />
    </CellContainer>
  );
};

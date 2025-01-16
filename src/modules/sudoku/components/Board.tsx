import styled from "styled-components";
import { Cell, CellState } from "./Cell";

type Props = {
  cells: CellState[];
  onCellClick: (row: number, col: number) => void;
  highlightBlocks?: number[];
  highlightRows?: number[];
  highlightCols?: number[];
};

const ARR_0_8 = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const Board = (props: Props) => {
  const { cells } = props;

  return (
    <Wrapper>
      {ARR_0_8.map((row) => {
        return (
          <Row key={row}>
            {ARR_0_8.map((col) => {
              return (
                <Cell
                  key={col}
                  col={col}
                  row={row}
                  borderRight
                  borderBottom
                  cellState={cells[row * 9 + col]}
                  onClick={() => props.onCellClick(row, col)}
                />
              );
            })}
            {props.highlightRows?.includes(row) && <RowBorder />}
          </Row>
        );
      })}

      <BoardBorder>
        <Block $left $top>
          {props.highlightBlocks?.includes(0) && <BlockBorder />}
        </Block>
        <Block $top>
          {props.highlightBlocks?.includes(1) && <BlockBorder />}
        </Block>
        <Block $right $top>
          {props.highlightBlocks?.includes(2) && <BlockBorder />}
        </Block>
        <Block $left>
          {props.highlightBlocks?.includes(3) && <BlockBorder />}
        </Block>
        <Block>{props.highlightBlocks?.includes(4) && <BlockBorder />}</Block>
        <Block $right>
          {props.highlightBlocks?.includes(5) && <BlockBorder />}
        </Block>
        <Block $left $bottom>
          {props.highlightBlocks?.includes(6) && <BlockBorder />}
        </Block>
        <Block $bottom>
          {props.highlightBlocks?.includes(7) && <BlockBorder />}
        </Block>
        <Block $right $bottom>
          {props.highlightBlocks?.includes(8) && <BlockBorder />}
        </Block>
      </BoardBorder>

      <ColBorderWrapper>
        {ARR_0_8.map((col) => {
          return (
            <div key={col} style={{ position: "relative" }}>
              {props.highlightCols?.includes(col) && <ColBorder />}
            </div>
          );
        })}
      </ColBorderWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
`;

const Row = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(9, 1fr);
`;

const BoardBorder = styled.div`
  position: absolute;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

const Block = styled.div<{
  $top?: boolean;
  $right?: boolean;
  $bottom?: boolean;
  $left?: boolean;
}>`
  position: relative;
  border: 1px solid rgb(52, 72, 97);
  ${(props) => props.$top && "border-top-width: 2px;"}
  ${(props) => props.$right && "border-right-width: 2px;"}
  ${(props) => props.$bottom && "border-bottom-width: 2px;"}
  ${(props) => props.$left && "border-left-width: 2px;"}
`;

const RowBorder = styled.div`
  position: absolute;
  pointer-events: none;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 4px solid rgb(50, 90, 175);
  z-index: 9;
`;

const BlockBorder = styled.div`
  position: absolute;
  pointer-events: none;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 4px solid rgb(50, 90, 175);
  border-radius: 0px;
`;

const ColBorderWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
`;

const ColBorder = styled.div`
  position: absolute;
  pointer-events: none;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 4px solid rgb(50, 90, 175);
  z-index: 9;
`;

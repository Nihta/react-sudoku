import styled from "styled-components";
import { Note } from "./Note";

export type CellState = {
  value: number | null;
  blinkValue?: number;
  selected: boolean;
  isOrigin: boolean;
  isConflict?: boolean;
  notes?: number[];
  status: "normal" | "high-light" | "high-light-number";
};

type CellProps = {
  borderLeft?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
  cellState: CellState;
  row: number;
  col: number;
  onClick?: () => void;
};

export const Cell = (props: CellProps) => {
  const { cellState } = props;

  const hasNotes = cellState?.notes && cellState.notes.length > 0;

  const cellIdx = props.row * 9 + props.col;

  return (
    <Wrapper
      onClick={props.onClick}
      $left={props.borderLeft ? 1 : 0}
      $right={props.borderRight ? 1 : 0}
      $top={props.borderTop ? 1 : 0}
      $bottom={props.borderBottom ? 1 : 0}
      $highLight={cellState.status === "high-light"}
      $highLightDarker={cellState.status === "high-light-number"}
      $conflict={cellState.isConflict}
      $selected={cellState.selected}
      title={`Cell ${cellIdx} (${props.row}, ${props.col})`}
    >
      {hasNotes ? (
        <Note values={cellState.notes} />
      ) : (
        <NumberWrapper
          $red={!cellState.isOrigin && cellState.isConflict}
          $blink={!!cellState.blinkValue}
        >
          {cellState.blinkValue ?? cellState.value}
        </NumberWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  $left: number;
  $right: number;
  $top: number;
  $bottom: number;
  $selected: boolean;
  $highLight: boolean;
  $highLightDarker: boolean;
  $conflict?: boolean;
}>`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  cursor: pointer;

  border: 0 rgb(191, 198, 212) solid;
  border-left-width: ${({ $left }) => `${$left}px`};
  border-right-width: ${({ $right }) => `${$right}px`};
  border-top-width: ${({ $top }) => `${$top}px`};
  border-bottom-width: ${({ $bottom }) => `${$bottom}px`};

  ${({ $highLight }) => $highLight && `background-color: rgb(226, 235, 243);`}
  ${({ $highLightDarker }) =>
    $highLightDarker && `background-color: rgb(195, 215, 234);`}

  ${({ $conflict }) => $conflict && `background-color: rgb(247, 207, 214);`}

  ${({ $selected }) => $selected && `background-color: rgb(187, 222, 251);`}
`;

const NumberWrapper = styled.div<{
  $red?: boolean;
  // blin animation
  $blink?: boolean;
}>`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  color: rgb(52, 72, 97);

  ${({ $red }) => $red && `color: rgb(229, 92, 108);`}

  ${({ $blink }) => $blink && `animation: blinker 1s linear infinite;`}

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

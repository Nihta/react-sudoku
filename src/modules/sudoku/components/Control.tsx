import styled from "styled-components";
import Pressable from "../../../components/base/Pressable";
import { BREAKPOINTS } from "../../../constants";
import { Eraser, Lightbulb, PenLine, RotateCcw } from "lucide-react";

type ControlProps = {
  actionUndo: () => void;
  actionDelete: () => void;
  actionNote: () => void;
  actionHint: () => void;
  noteMode: boolean;
  hintMode: boolean;
};

export function Control(props: ControlProps) {
  const { actionUndo, actionDelete, actionNote, actionHint, noteMode } = props;

  const disabledUndo = props.hintMode;
  const disabledErase = props.hintMode;
  const disabledNote = props.hintMode;

  return (
    <Wrapper>
      <ItemWrapper>
        <ItemIcon
          onClick={() => {
            if (!disabledUndo) {
              actionUndo();
            }
          }}
          $disabled={disabledUndo}
        >
          <RotateCcw />
        </ItemIcon>
        <Label $disabled={disabledUndo}>Undo</Label>
      </ItemWrapper>

      <ItemWrapper>
        <ItemIcon
          onClick={() => {
            if (!disabledErase) {
              actionDelete();
            }
          }}
          $disabled={disabledErase}
        >
          <Eraser />
        </ItemIcon>
        <Label $disabled={disabledErase}>Erase</Label>{" "}
      </ItemWrapper>

      <ItemWrapper>
        <ItemIcon
          onClick={() => {
            if (!disabledNote) {
              actionNote();
            }
          }}
          className={noteMode ? "active" : ""}
          $disabled={disabledNote}
        >
          <PenLine />
        </ItemIcon>
        <Label $disabled={disabledNote}>Note</Label>
      </ItemWrapper>

      <ItemWrapper>
        <ItemIcon
          onClick={actionHint}
          className={props.hintMode ? "active" : ""}
        >
          <Lightbulb />
        </ItemIcon>
        <Label>{props.hintMode ? "Apply" : "Hint"}</Label>
      </ItemWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* @media (min-width: 801px) { */
  /* width: 100%; */
  /* padding: 0 6%; */
  color: var(--color-primary);

  display: flex;
  justify-content: space-between;
  /* } */
`;

const ItemWrapper = styled.div`
  flex-basis: 25%;
  flex-grow: 1;
  margin-left: 5%;

  &:first-child {
    margin-left: 0;
  }

  @media (min-width: 768px) {
    max-width: 60px;
  }
`;

const ItemIcon = styled(Pressable)<{
  $disabled?: boolean;
}>`
  position: relative;
  width: 100%;
  height: 30px;

  @media ${BREAKPOINTS.smAndLarger} {
    border-radius: 50%;
    aspect-ratio: 1/1;
    display: block;
    height: auto;
  }

  &.active {
    border: 2px solid var(--color-primary);
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-primary);
    height: 28px;
    ${({ $disabled }) => $disabled && `color: #94a3b7;`}
  }
`;

const Label = styled.span<{
  $disabled?: boolean;
}>`
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-top: 5px;
  color: var(--color-primary);

  display: none;
  @media ${BREAKPOINTS.smAndLarger} {
    display: block;
  }

  ${({ $disabled }) => $disabled && `color: #94a3b7;`}
`;

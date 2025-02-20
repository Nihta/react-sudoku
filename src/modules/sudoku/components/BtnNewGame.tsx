import React from "react";
import styled from "styled-components";
import { useOnClickOutside } from "usehooks-ts";

import Button from "../../../components/base/Button";
import Pressable from "../../../components/base/Pressable";
import { Difficulty } from "../sudokuTypes.ts";
import { actionAutoSolve } from "../stores/actionAutoSolve";
import { actionToggleHighlightMode } from "../stores/actionToggleHighlightMode";
import { Key, RotateCcw } from "lucide-react";
import { useBoardStore } from "../stores/useBoard";

const LEVELS: Difficulty[] = ["easy", "medium", "hard", "expert", "evil"];

type BtnNewGameProps = {
  onNewGame: (level: Difficulty) => void;
  onRestart: () => void;
};

export default function BtnNewGame(props: BtnNewGameProps) {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef(null);

  const toggle = () => {
    setActive(!active);
  };

  useOnClickOutside(ref, () => {
    if (active) {
      setActive(false);
    }
  });

  return (
    <Wrapper ref={ref}>
      {active && (
        <NewGameContent
          onRestart={() => {
            toggle();
            props.onRestart();
          }}
          onNewGame={(level) => {
            toggle();
            props.onNewGame(level);
          }}
          onToggle={toggle}
        />
      )}
      <Button type="button" label="New game" onClick={toggle} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

type NewGameContentProps = {
  onRestart: () => void;
  onNewGame: (level: Difficulty) => void;
  onToggle: () => void;
};

export const NewGameContent = (props: NewGameContentProps) => {
  return (
    <ContentWrapper>
      <Actions callBack={props.onToggle} />
      {LEVELS.map((lvl) => {
        return (
          <ContentItem key={lvl} onClick={() => props.onNewGame(lvl)}>
            <Key />
            {lvl}
          </ContentItem>
        );
      })}
      <LastContentItem onClick={() => props.onRestart()}>
        <RotateCcw />
        Restart
      </LastContentItem>
      <TooltipArrow />
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  position: absolute;
  background-color: #fff;
  bottom: calc(100% + 19px);
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-in-out;
  z-index: 999;

  @media screen and (max-width: 979px) {
    top: calc(100% + 14px);
    right: 10px;
    left: auto;
    bottom: auto;
    transform: none;
  }
`;

const TooltipArrow = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  width: 50px;
  height: 25px;
  transform: translateX(-50%);
  overflow: hidden;

  @media screen and (max-width: 979px) {
    right: 25px;
    left: auto;
    transform: none;
    bottom: 100%;
    top: auto;
  }

  :after {
    content: "";
    position: absolute;
    top: 5px;
    left: 50%;
    width: 20px;
    height: 20px;
    background: #fff;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.2);
    border-top-left-radius: 4px;

    transform: translateX(-50%) translateY(50%) rotate(45deg);
    @media screen and (min-width: 980px) {
      transform: translateX(-50%) translateY(-80%) rotate(45deg);
    }
  }
`;

const ContentItem = styled(Pressable)`
  padding: 12px 15px;
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    margin-right: 10px;
  }

  background-color: #f3f6fa;

  &:hover {
    background-color: #e4eaf1;
  }

  &:active {
    background-color: #f3f6fa;
  }

  border-radius: 0;
  border-top: 1px solid #e0e8f7;

  // todo: why :first-child not working
  &:nth-child(2) {
    border-top: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
`;

const LastContentItem = styled(ContentItem)`
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

type ActionProps = {
  callBack: () => void;
};

const Actions = (props: ActionProps) => {
  const tryToAutoSolve = async () => {
    props.callBack();
    actionAutoSolve();
  };

  const isSupperHighLight = useBoardStore(
    (st) => st.highlightMode === "supper"
  );

  return (
    <ActionWrapper>
      <Action onClick={tryToAutoSolve}>
        <span>Try to solve</span>
      </Action>
      <Action
        onClick={actionToggleHighlightMode}
        className={isSupperHighLight ? "active" : ""}
      >
        <span>Super Highlight</span>
      </Action>
    </ActionWrapper>
  );
};

const ActionWrapper = styled.div`
  display: flex;
  margin-bottom: 15px;
`;
const Action = styled.div`
  flex-basis: 100%;
  padding: 10px 5px;
  background: #fff;
  border: 1px solid #e0e8f7;
  border-radius: 5px;
  transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out;
  color: #6e7c8c;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  text-align: center;
  cursor: pointer;

  &:first-child {
    margin-right: 10px;
  }

  &:hover {
    border-color: #e0e8f7;
    background-color: #f3f6fa;
  }

  &:active {
    background-color: #f3f4f8;
  }

  &.active {
    background: #0072e3;
    color: #fff;
    border: 1px solid #0072e3;
  }
`;

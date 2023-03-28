import Button from "./base/Button";
import styled from "styled-components";
import Pressable from "./base/Pressable";
import React from "react";
import { KeySvg, RefreshSvg } from "./svgs";
import { actionNewGame, actionRePlay } from "../zustand/Sudoku";
import { Difficulty } from "../types/sudokuTypes";
import { useGameStore } from "../zustand/useGameStore";
import { useOnClickOutside } from "usehooks-ts";

const LEVELS: Difficulty[] = ["easy", "medium", "hard", "expert", "evil"];

export default function BtnNewGame() {
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
      {active && <NewGameContent callBack={toggle} />}
      <Button type="button" label="New game" onClick={toggle} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

type NewGameContentProps = {
  callBack: () => void;
};

export const NewGameContent = ({ callBack }: NewGameContentProps) => {
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  const getPuzzle = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    actionNewGame();
    callBack();
  };

  return (
    <ContentWrapper>
      {LEVELS.map((lvl) => {
        return (
          <ContentItem
            key={lvl}
            onClick={() => {
              getPuzzle(lvl);
            }}
          >
            <KeySvg />
            {lvl}
          </ContentItem>
        );
      })}
      <LastContentItem
        onClick={() => {
          actionRePlay();
          callBack();
        }}
      >
        <RefreshSvg />
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
  //background-color: red;

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

  :first-child {
    border-top: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
`;

const LastContentItem = styled(ContentItem)`
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

import React from "react";
import styled from "styled-components";
import {X} from "lucide-react";

import { convertTime } from "../../../utils/timeUtils";
import Pressable from "../../../components/base/Pressable";

type GameVictoryAlertProps = {
  difficulty: string;
  time: number;
};

export function GameVictoryAlert(props: GameVictoryAlertProps) {
  const { time, difficulty } = props;

  const [isReview, setIsReview] = React.useState(false);

  const review = () => {
    setIsReview(true);
  };

  if (isReview) {
    return null;
  }

  return (
    <Wrapper>
      <Title>Congratulations</Title>
      <ListItem>
        <span>Difficulty:</span>
        <span>{difficulty}</span>
      </ListItem>
      <ListItem>
        <span>Time:</span>
        <span>{convertTime(time)}</span>
      </ListItem>
      <Actions>
        <Item onClick={review}>
          <X />
        </Item>
      </Actions>
    </Wrapper>
  );
}

const Actions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Item = styled(Pressable)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent !important;

  svg {
    fill: rgba(255, 255, 255, 0.5);
    width: 70%;

    :hover {
      fill: rgba(255, 255, 255, 0.7);
    }

    :active {
      fill: rgba(255, 255, 255, 1);
    }
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 99;
  background-color: var(--color-primary);
  color: white;
  opacity: 1;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ListItem = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  span {
    text-transform: capitalize;
  }
`;

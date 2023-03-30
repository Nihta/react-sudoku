import React, { useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "usehooks-ts";

import { NewGameContent } from "./BtnNewGame";
import Container from "./base/Container";

export default function Header() {
  const [active, setActive] = useState(false);

  const ref = React.useRef(null);

  const toggle = () => {
    setActive((a) => !a);
  };

  useOnClickOutside(ref, () => {
    if (active) {
      setActive(false);
    }
  });

  return (
    <Wrapper>
      <ContentWrapper>
        <Logo>Sudoku</Logo>
        <Content ref={ref}>
          <NewGameButton onClick={toggle}>New game</NewGameButton>
          {active && (
            <NewGameContent
              callBack={() => {
                setActive(false);
              }}
            />
          )}
        </Content>
      </ContentWrapper>
    </Wrapper>
  );
}

const NewGameWrapper = styled.div`
  position: relative;
`;

const Content = styled(NewGameWrapper)`
  @media (min-width: 980px) {
    display: none;
  }
`;

const Wrapper = styled.header`
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(0, 63, 123, 0.1);
  display: flex;
  justify-content: center;

  height: 60px;
  @media (min-width: 980px) {
    height: 70px;
  }
`;

const ContentWrapper = styled(Container)`
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   height: 100%;
`;

const Logo = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #344861;
  cursor: pointer;
`;

const NewGameButton = styled.div`
  margin-right: 18px;
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  &:active {
    color: #3a90e5;
  }

  @media (min-width: 980px) {
    display: none;
  }
`;

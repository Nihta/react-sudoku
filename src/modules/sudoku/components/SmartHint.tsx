import { Check } from "lucide-react";
import styled from "styled-components";

type Props = {
  title: string;
  onDone: () => void;
};

export const SmartHint = ({ onDone, title }: Props) => {
  return (
    <Container>
      <Name>{title}</Name>
      <Desc>
        <DescItem className={"active"}>
          {/* In <span>this block</span>, there is only one cell remaining that can
          contain 9 */}
          {title}
        </DescItem>
      </Desc>
      <Nav className={"active"}>
        <NavBtn onClick={onDone}>
          <Check />
        </NavBtn>
      </Nav>
    </Container>
  );
};

const Container = styled.div`
  min-height: 150px;
  border-radius: 5px;
  padding: 22px 20px 18px;
  background-color: white;
  border: 2px solid rgb(52, 72, 97);

  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s;
  width: 100%;
  z-index: 20;
`;

const Name = styled.div`
  color: #344861;
  display: block;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: normal;
  line-height: normal;
  margin: 0 0 6px;
  text-align: center;
`;

const Desc = styled.div`
  color: #94a3b7;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: normal;
  line-height: 1.33;
  overflow: hidden;
  position: relative;
  text-align: center;
  transform-style: preserve-3d;
  user-select: none;
  min-height: 40px;
`;

const DescItem = styled.div`
  color: #94a3b7;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: normal;
  line-height: 1.33;
  text-align: center;

  opacity: 0;
  position: absolute;
  top: 0;
  transition: transform 0.5s, opacity 0.5s, z-index 0.5s;
  z-index: 100;

  &.active {
    opacity: 1;
    position: relative;
    z-index: 200;
  }

  &.prev {
    transform: translateX(-100%);
  }

  &.next {
    transform: translateX(100%);
  }
`;

const Nav = styled.div`
  align-items: center;
  display: none;
  justify-content: flex-end;
  /* margin-top: 20px; */
  position: relative;

  &.active {
    display: flex;
  }
`;

const NavBtn = styled.button<{
  $hidden?: boolean;
}>`
  align-items: center;
  background-color: #f3f6fa;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  outline: none;
  padding: 0;
  position: relative;
  width: 40px;
  -webkit-tap-highlight-color: transparent;
  transition: 0.2s;

  &:hover {
    background-color: #dce3ed;
  }

  ${({ $hidden }) => $hidden && "display: none;"}

  & > svg {
    color: #325aaf;
  }
`;

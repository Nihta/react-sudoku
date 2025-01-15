import clsx from "clsx";
import { useState } from "react";
import styled from "styled-components";

export const SmartHint = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prev) => (prev + 1) % 3);
  };

  const prevStep = () => {
    setStep((prev) => (prev + 2) % 3);
  };

  const handleDone = () => {
    console.log("done");
  };

  return (
    <Container>
      <Name>Ô Còn lại Cuối cùng</Name>
      <Desc>
        <DescItem
          className={clsx(
            step === 0 && "active",
            step === 1 && "prev",
            step === 2 && "prev"
          )}
        >
          Chú ý đến <span className="green">các ô này</span> và các vùng được tô
          sáng
        </DescItem>
        <DescItem
          className={clsx(
            step === 0 && "next",
            step === 1 && "active",
            step === 2 && "prev"
          )}
        >
          Trong <span>khối này</span>, chỉ còn lại một ô có thể chứa 7
        </DescItem>
        <DescItem
          className={clsx(
            step === 0 && "next",
            step === 1 && "next",
            step === 2 && "active"
          )}
        >
          Ô này phải là 7 vì đó là tùy chọn duy nhất có thể
        </DescItem>
      </Desc>
      <Nav className={"active"}>
        <NavBtn
          onClick={prevStep}
          style={{ visibility: step === 0 ? "hidden" : "visible" }}
        >
          {"<"}
        </NavBtn>
        <NavBtn onClick={nextStep} $hidden={step === 2}>
          {">"}
        </NavBtn>
        <NavBtn onClick={handleDone} $hidden={step !== 2}>
          {"O"}
        </NavBtn>

        <Dots>
          <Dot className={step === 0 ? "active" : ""} />
          <Dot className={step === 1 ? "active" : ""} />
          <Dot className={step === 2 ? "active" : ""} />
        </Dots>
      </Nav>
    </Container>
  );
};

const Container = styled.div`
  min-height: 150px;
  border-radius: 5px;
  padding: 22px 20px 18px;
  background-color: white;
  border: 1px solid #e0e6ed;

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
  font-size: 15px;
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
  justify-content: space-between;
  margin-top: 20px;
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
`;

const Dots = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 50px;
  margin: auto;
  position: absolute;
  right: 50px;
  top: 0;
`;

const Dot = styled.div`
  background-color: #c3cbd5;
  border-radius: 50%;
  display: block;
  height: 7px;
  margin: 0 4px;
  transition: 0.5s;
  width: 7px;

  &.active {
    background-color: #325aaf;
  }
`;

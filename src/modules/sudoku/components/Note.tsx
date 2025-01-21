import styled from "styled-components";

type NoteProps = {
  values?: number[];
};

const ARR = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Note = (props: NoteProps) => {
  return (
    <Wrapper>
      {ARR.map((value) => {
        return (
          <NumberWrapper key={value}>
            <Number>{props.values?.includes(value) ? value : ""}</Number>
          </NumberWrapper>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  font-size: 12px;
`;

const NumberWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Number = styled.div`
  position: absolute;
  inset: 0;
  color: rgb(100, 124, 140);
  display: flex;
  justify-content: center;
  align-items: center;
`;

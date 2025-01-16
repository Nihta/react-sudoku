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
            {props.values?.includes(value) ? value : ""}
          </NumberWrapper>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  font-size: 0.75rem;
  line-height: 1rem;
`;

const NumberWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(100, 124, 140);
`;

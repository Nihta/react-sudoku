import styled from "styled-components";

type BoardLinesProps = {
  line: number;
  lineSize: number;
  backgroundColor: string;
};

export const BoardLines = ({
  line,
  lineSize,
  backgroundColor,
}: BoardLinesProps) => {
  return (
    <>
      <LinesContainer>
        {Array.from({ length: line }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "100%",
              width: `${lineSize}px`,
              backgroundColor: backgroundColor,
            }}
          ></div>
        ))}
      </LinesContainer>
      <RowContainer>
        {Array.from({ length: line }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: `${lineSize}px`,
              backgroundColor: backgroundColor,
            }}
          ></div>
        ))}
      </RowContainer>
    </>
  );
};
const LinesContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const RowContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

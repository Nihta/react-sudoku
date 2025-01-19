import styled from "styled-components";

type CellProps = {
  value: number;
  transparent?: boolean;
  overlay?: boolean;
};

export const Cell2 = (props: CellProps) => {
  return (
    <Container
      style={{
        backgroundColor: props.transparent ? "transparent" : "white",
        borderWidth: "4px",
        borderColor: "red",
      }}
    >
      {props.value !== 0 && props.value}

      {props.overlay && <Overlay />}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  text-align: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

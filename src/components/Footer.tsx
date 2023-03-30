import styled from "styled-components";
import Container from "./base/Container";

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <div>@Nihta ~ 2023</div>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  margin-top: 50px;
  background-color: #222e3e;
  color: #fff;
  font-size: 16px;
  font-weight: 6500;
  padding: 20px 0;
`;

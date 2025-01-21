import styled from "styled-components";
import Container from "./base/Container";

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <div title="Nov 2, 2019">@Nihta 2019 - 2025</div>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  padding-top: 48px;
  background-color: #222e3e;
  color: #fff;
  font-size: 16px;
  font-weight: 6500;
  padding: 20px 0;
`;

import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import styled from "styled-components";
import GlobalStyles from "../base/GlobalStyles";
import Footer from "../Footer";
import Header from "../Header";

export const MainLayout = () => {
  return (
    <Wrapper>
      <GlobalStyles />
      <Header />

      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      <Footer />

      <Toaster />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

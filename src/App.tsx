import "./App.css";
import GlobalStyles from "./components/base/GlobalStyles";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <>
      <GlobalStyles />
      <header className="site-header" />
      <div className="container site-content-wrapper">
        <div className="site-content">
          <Sudoku />
        </div>
        <aside className="aside"></aside>
      </div>
    </>
  );
}

export default App;

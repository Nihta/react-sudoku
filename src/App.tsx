import "./App.css";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <>
      <header className="site-header" />
      <div className="container site-content-wrapper">
        <div className="site-content">
          <Sudoku />
        </div>
        <aside className="aside">
        </aside>
      </div>
    </>
  );
}

export default App;

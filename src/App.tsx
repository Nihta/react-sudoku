import "./App.css";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <div className="container site-content-wrapper">
      <div className="site-content">
        <Sudoku />
      </div>
      <aside className="aside" />
    </div>
  );
}

export default App;

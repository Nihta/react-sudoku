import "./Control.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEraser,
  faLightbulb,
  faTh,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import useSudokuStore from "../zustand/useSudokuStore";

type ControlProps = {};

function Control(props: ControlProps) {
  const actionDelete = useSudokuStore((st) => st.actionDelete);

  return (
    <>
      <div className="sudoku-control">
        <button className="game-action-button" aria-label="Undo">
          <FontAwesomeIcon icon={faUndo} />
          <p>Hoàn tác</p>
        </button>
        <button
          className="game-action-button"
          aria-label="Erase"
          onClick={actionDelete}
        >
          <i className="fa fa-eraser" aria-hidden="true"></i>
          <FontAwesomeIcon icon={faEraser} />
          <p>Xoá</p>
        </button>
        <button className="game-action-button" aria-label="Note">
          <FontAwesomeIcon icon={faEdit} />
          <p>Ghi chú</p>
        </button>
        <button className="game-action-button" aria-label="Hint">
          <FontAwesomeIcon icon={faLightbulb} />
          <p>Gợi ý</p>
        </button>
        <button className="game-action-button" aria-label="Pro mode">
          <FontAwesomeIcon icon={faTh} />
          <p>Pro</p>
        </button>
      </div>
    </>
  );
}

export default Control;

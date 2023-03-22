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
  const actionHint = useSudokuStore((st) => st.actionHint);

  return (
    <>
      <div className="game-controls">
        <div className=" game-controls-item-wrap">
          <div className="game-controls-item">
            <FontAwesomeIcon icon={faUndo} />
          </div>
          <p className="game-controls-label">Hoàn tác</p>
        </div>
        <div className="game-controls-item-wrap" onClick={actionDelete}>
          <div className="game-controls-item">
            <FontAwesomeIcon icon={faEraser} />
          </div>
          <p className="game-controls-label">Xoá</p>
        </div>
        <div className="game-controls-item-wrap">
          <div className="game-controls-item">
            <FontAwesomeIcon icon={faEdit} />
          </div>
          <p className="game-controls-label">Ghi chú</p>
        </div>
        <div className="game-controls-item-wrap" onClick={actionHint}>
          <div className="game-controls-item">
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <p className="game-controls-label">Gợi ý</p>
        </div>
      </div>
    </>
  );
}

export default Control;

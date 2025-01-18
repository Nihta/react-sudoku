import useKeyDown from "../../../hooks/useKeyDown";
import { actionMove } from "../stores/actionMove";
import { actionDelete, actionInputCell } from "../stores/useBoard";

export const useKeyboard = () => {
  useKeyDown((e) => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft":
        e.preventDefault();
        actionMove("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        actionMove("right");
        break;
      case "ArrowUp":
        e.preventDefault();
        actionMove("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        actionMove("down");
        break;
      case "Backspace":
      case "Delete":
        actionDelete();
        break;
      default:
        if (1 <= +key && +key <= 9) {
          actionInputCell(parseInt(key, 10));
          break;
        }
    }
  });
};

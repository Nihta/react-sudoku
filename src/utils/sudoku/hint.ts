import { addHistory, setNotes } from "../../zustand/Sudoku";
import { getNewNotes } from "./fillNote";
import { hiddenPairs } from "./hidden-pairs";
import { hiddenSingles } from "./hiddenSingles";
import { obviousPairs } from "./obviousPairs";
import { pointingPairs } from "./pointingPairs";

/**
 *
 */
export const hint = () => {
  // Always check notes first
  const { change, newNotes } = getNewNotes();

  if (change > 0) {
    // todo: I'm not sure whether to save history before or after setNotes
    addHistory();
    // Để tiến tới đáp án, phải điền đúng tất cả các số có thể cho mỗi ô dưới dạng ghi chú
    console.info(
      `Ghi chú trong các ô này bị thiếu hoặc được điền không đúng. (change=${change})`
    );
    setNotes(newNotes);
    return;
  }

  // Bộ đôi ẩn

  // Chỉ các ô này chứa 2 và 6. Điều này có nghĩa là phải thêm 2 vào một
  // trong các ô này và thêm 6 vào ô kia.
  let found = hiddenPairs();
  if (found) {
    addHistory();
    console.info(`Bộ đôi ẩn`);
    return;
  }

  found = hiddenSingles();
  if (found) {
    addHistory();
    console.info(`Số ẩn`);
    return;
  }

  found = obviousPairs();
  if (found) {
    addHistory();
    console.info(`Cặp rõ ràng`);
    return;
  }


  found = pointingPairs();
  if (found) {
    console.info(`Bộ đôi chỉ hướng`);
    return;
  }

  console.info("Không tìm thấy gợi ý nào :((");
};

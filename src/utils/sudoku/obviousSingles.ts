import { ETechnique } from "../../types/technique.type";
import useSudokuStore from "../../zustand/useSudokuStore";

/**
 * "Obvious singles" technique
 */
export const obviousSingles = () => {
  const notes = useSudokuStore.getState().notes;

  // find note that has only one number
  for (let i = 0; i < 81; i++) {
    if (notes[i].length === 1) {
      return {
        type: ETechnique.obviousSingles,
        payload: {
          position: i,
          value: notes[i][0],
        },
      };
    }
  }

  return null;
};

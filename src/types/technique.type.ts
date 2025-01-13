// Technique
export type TechniqueResult = {
  type: 'lastFreeCell';
  detail: {
    type: 'row' | 'col' | 'block';
    value: number;
  };
  correct: {
    pos: number;
    value: number;
  };
};

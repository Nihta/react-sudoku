// Technique
export type TechniqueResult = {
  type: "lastFreeCell";
  detail: {
    type: "row" | "col" | "block";
    value: number;
  };
  correct: {
    pos: number;
    value: number;
  };
};

// enum technique
export enum ETechnique {
  lastFreeCell = "lastFreeCell",
  lastRemainingCell = "lastRemainingCell",
  hiddenSingles = "hiddenSingles",
  obviousPairs = "obviousPairs",
  hiddenPairs = "hiddenPairs",
  pointingPairs = "pointingPairs",
  obviousSingles = "obviousSingles",
  lastPossibleNumber = "lastPossibleNumber",
  obviousTriples = "obviousTriples",
}

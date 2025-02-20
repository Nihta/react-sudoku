import styled from "styled-components";
import Select from "../../../components/base/Select";
import { Difficulty } from "../sudokuTypes.ts";

const LEVELS: {
  label: Difficulty;
  value: Difficulty;
}[] = [
  {
    label: "easy",
    value: "easy",
  },
  {
    label: "medium",
    value: "medium",
  },
  {
    label: "hard",
    value: "hard",
  },
  {
    label: "expert",
    value: "expert",
  },
  {
    label: "evil",
    value: "evil",
  },
];

type SelectDifficultyProps = {
  difficulty?: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
};

export default function SelectDifficulty(props: SelectDifficultyProps) {
  const { difficulty } = props;

  return (
    <Wrapper>
      <LevelTitle>Difficulty:</LevelTitle>
      <StyledSelect
        options={LEVELS}
        selected={difficulty ?? ""}
        onChange={(diff) => {
          props.onDifficultyChange(diff as Difficulty);
        }}
      />

      <LevelItems>
        {LEVELS.map((lvl) => {
          return (
            <LevelItem
              key={lvl.value}
              $active={difficulty === lvl.value}
              onClick={() => {
                props.onDifficultyChange(lvl.value);
              }}
            >
              {lvl.label}
            </LevelItem>
          );
        })}
      </LevelItems>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LevelTitle = styled.span`
  margin-right: 7px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  align-items: center;

  color: #344861;
  @media (min-width: 980px) {
    color: #94a3b7;
  }
`;

const StyledSelect = styled(Select)`
  @media (min-width: 980px) {
    display: none !important;
  }
`;

const LevelItems = styled.div`
  line-height: 1.25;
  display: none;
  @media (min-width: 980px) {
    display: flex;
    align-items: center;
  }
`;

const LevelItem = styled.span<{
  $active?: boolean;
}>`
  padding: 8px;
  margin-right: 4px;
  font-weight: 600;
  border-radius: 4px;
  color: #6e7c8c;
  text-transform: capitalize;
  cursor: pointer;

  &:hover {
    background-color: #f1f4f8;
  }

  &:active {
    background-color: #eaeef4;
  }

  ${(p) => p.$active && ` color: #0072e3;`};

  @media screen and (max-width: 767px) {
    background: transparent;
    padding: 5px;
    &:hover {
      background: transparent;
    }

    &:active {
      background: #d2dae7;
    }
  }
`;

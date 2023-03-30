import styled from "styled-components";

import { ChevronDownSvg } from "../svgs";

type SelectProps = {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function Select(props: SelectProps) {
  const { selected, options, onChange, className } = props;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <Wrapper className={className}>
      <Label>
        {options.find((option) => option.value === selected)?.label}
      </Label>
      <DropdownIcon>
        <ChevronDownSvg />
      </DropdownIcon>
      <SelectStyled value={selected} onChange={handleSelect}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectStyled>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: #94a3b7;
  font-size: 16px;
  line-height: 25px;
  vertical-align: middle;
  text-transform: capitalize;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const DropdownIcon = styled.div`
  width: 16px;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.span`
  color: #94a3b7;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
`;

const SelectStyled = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  text-transform: capitalize;
`;

import styled from "styled-components";
import React from "react";

type StyledButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button<StyledButtonProps>`
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  padding: 0 24px;
  height: 60px;
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: #fff;
  line-height: 60px;
  outline: none;

  background-color: var(--color-primary);
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #0065c8;
  }

  &:active {
    background-color: #3a90e5;
  }

  &:focus {
    outline: 2px auto #3a90e5;
    outline-offset: 2px;

    &:not(.focus-visible) {
      outline: none;
    }
  }
`;

type ButtonProps = StyledButtonProps & {
  label: string;
};

const Button = (props: ButtonProps) => {
  const { label, ...rest } = props;
  return <StyledButton {...rest}>{label}</StyledButton>;
};

export default Button;

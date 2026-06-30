import React, { FC, ReactNode } from "react";

interface ButtonProps {
  disabled?: boolean;
  name: string;
  className?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  children?: ReactNode; 
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    name,
    className,
    disabled = false,
    onClick,
    type,
    ...rest
  } = props;

  const defaultStyle = "custom-button animation-on-hover";
  
  return (
    <button
      className={className || defaultStyle}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...rest}
    >
      { name }
    </button>
  )
}

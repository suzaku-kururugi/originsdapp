import React, {
  forwardRef,
  ForwardedRef,
  ForwardRefRenderFunction,
  useState,
} from "react";

interface InputProps {
  className: string;
  value: string;
  onChange: (value: string) => void;
  onClick: () => void;
}
const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { className, value, onClick, onChange },
  ref
) => {
  return (
    <input
      className={className}
      type="text"
      value={value}
      ref={ref as ForwardedRef<HTMLInputElement>}
      onChange={(e) => console.log(e.target)}
      onClick={onClick}
    />
  );
};

export default forwardRef(Input);

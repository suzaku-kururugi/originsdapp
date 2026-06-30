import React, { FC, PropsWithChildren } from 'react';

export const HoverTooltip: FC<PropsWithChildren<{ text?: string, className?: string }>> = ({ text, children, className = "tooltip-text icon" }) => {
  return (
    <div className="tooltip-container">
      {children}
      {text && <div className={ className }>{ text }</div>}
    </div>
  );
};

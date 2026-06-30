import React, {FC, PropsWithChildren, useState } from 'react';

export const Tooltip: FC<PropsWithChildren<{text?: string}>> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {text && visible && <div className="tooltip-text icon">{text}</div>}
    </div>
  );
};

import React, { FC, PropsWithChildren } from "react";

export const Container: FC<PropsWithChildren> = ({ children }) => {

  return (
    <div className="container px-4 lg:px-0 lg:mx-auto max-w-screen-container">
      {children}
    </div>
  )
}

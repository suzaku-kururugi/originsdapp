import React, { useState, FC, Dispatch, SetStateAction } from "react";

export const Checkbox: FC<{active: boolean, setActive: Dispatch<SetStateAction<boolean>>}> = ({ active, setActive }) => {

  return (
    <div className={`checkbox__container ${active ? "checked" : ""}`} onClick={() => setActive(!active)}>
      <div className={`checkbox__item ${active ? "checked" : ""}`}>
      </div>
    </div>
  )
}
import React, { forwardRef } from "react";
import Input from "./input";

export const CustomInput = forwardRef((props: any, ref) => {

  return <Input {...props} ref={ref} />
});

CustomInput.displayName = "CustomInput";


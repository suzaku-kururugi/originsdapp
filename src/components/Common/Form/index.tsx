import React, { FC, FormEventHandler, PropsWithChildren } from "react";
import { Form as FinalForm } from "react-final-form";

interface FromProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  initialValues?: any;
}

export const Form: FC<PropsWithChildren<FromProps>> = ({
  children,
  initialValues,
  onSubmit,
}) => {
  return (
    <FinalForm onSubmit={onSubmit} initialValues={initialValues}>
      {(props) => {
        return (
        <form onSubmit={props.handleSubmit}>
          { children }
        </form>);
      }}
    </FinalForm>
  );
};

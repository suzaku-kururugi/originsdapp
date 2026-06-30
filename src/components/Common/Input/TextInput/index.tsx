import React, {
  FC,
  useState,
  InputHTMLAttributes,
  PropsWithChildren,
} from "react";
import { Field, FieldRenderProps, useFormState, FieldProps as FinalFieldProps } from "react-final-form";
import { inputStyles } from "../styles";
import { Validate, getFieldValidators } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value?: string;
  validate?: Validate;
  onChange: (e: any) => void;
}

type InputPropsType = InputProps & Omit<FinalFieldProps<string | number | boolean, any>, "validate">

export const InputTextField: FC<PropsWithChildren<InputPropsType>> = ({
  children,
  onChange,
  onFocus,
  name,
  type,
  label,
  required,
  error,
  validate,
  ...props
}) => {
  const { values: formValues } = useFormState();

  return (
    <Field
      name={name}
      type={type}
      validate={getFieldValidators(validate, formValues)}
    >
      {({ input, meta }: FieldRenderProps<unknown, HTMLElement>) => {
        const inputProps = {
          ...props,
          ...input,
          value: input.value !== undefined ? input.value as string : "",
          onChange: (ev: any) => {
            onChange?.(ev);
            input.onChange(ev);
          },
          onFocus: (ev: any) => {
            onFocus?.(ev);
            input.onFocus(ev);
          },
        };

        const hasError = error || (meta.error && meta.touched);
        const errorText = hasError ? `${meta.error?.[0]?.code}` : undefined;

        return (
          <div>
            <div className="field-label">
              {label}
              {!required ? null : (
                <div className="mx-1 text-red-600">{"*"}</div>
              )}
            </div>
            <input
              autoComplete="off"
              type={type || "text"}
              color="black"
              className={inputStyles}
              {...inputProps}
            />
            <div style={{
              fontSize: "x-small",
              height: "16px",
              color: "red",
              padding: "4px 0 0 10px"
            }}>
              {errorText}
            </div>
          </div>
        );
      }}
    </Field>
  );
};

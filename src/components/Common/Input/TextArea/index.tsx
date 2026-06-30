import React, { FC, InputHTMLAttributes, PropsWithChildren } from "react";
import { Field, FieldRenderProps, useFormState, FieldProps as FinalFieldProps } from "react-final-form";
import { textAreaStyles } from "../styles";
import { Validate, getFieldValidators } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> { 
  label: string;
  name: string;
  value?: string;
  validate?: Validate;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

type InputPropsType = InputProps & Omit<FinalFieldProps<string | number | boolean, any>, "validate">

export const InputTextArea: FC<PropsWithChildren<InputPropsType>> = ({
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
      {({ input, meta }: FieldRenderProps<unknown, HTMLTextAreaElement>) => {
        const inputProps = {
          ...props,
          ...input,
          value: input.value !== undefined ? input.value as string : "",
          onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => { 
            onChange?.(ev);
            input.onChange(ev);
          },
          onFocus: (ev: React.FocusEvent<HTMLTextAreaElement>) => {
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
            <textarea
              autoComplete="off"
              rows={props.rows ? props.rows : 5}
              color="black"
              className={textAreaStyles}
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

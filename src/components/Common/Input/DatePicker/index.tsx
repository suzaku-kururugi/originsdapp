import React, { FC, InputHTMLAttributes, PropsWithChildren, forwardRef, useRef } from "react";
import DatePicker, {
  DatePickerProps,
} from "react-datepicker";
import {
  Field as FinalFormField,
  FieldRenderProps,
  useFormState,
  FieldProps as FinalFieldProps,
} from "react-final-form";
import { Validate, getFieldValidators } from "@/utils";

import { CustomHeader } from "./CustomHeader"; 
import { CustomInput } from "./CustomInput";

import { inputStyles } from "../styles";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";

interface InputDateProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value?: string;
  validate?: Validate;
  onChange: (e: any) => void;
}
type ResultDatePickerProps = InputDateProps & Omit<FinalFieldProps<string | number | boolean, any>, "validate"> & DatePickerProps


export const DatePickerInput: FC<PropsWithChildren<ResultDatePickerProps>> = ({
  children,
  label,
  onChange,
  required,
  name,
  onFocus,
  error,
  type,
  validate,
  minDate,
  maxDate,
  ...props
}) => {
  const { values: formValues } = useFormState();
  const inputRef = useRef(null)

  return (
    <FinalFormField
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
          <div className="w-full">
            <div className="field-label">
              {label}
              {!required ? null : (
                <div className="mx-1 text-red-600">{"*"}</div>
              )}
            </div>
            <DatePicker
              wrapperClassName="datePicker"
              closeOnScroll={(e) => e.target === document}
              className={inputStyles}
              calendarClassName={"datePickerCalendar"}
              renderCustomHeader={(props) => <CustomHeader {...props}></CustomHeader>}
              // customInput={<CustomInput inputRef={inputRef}/>}
              autoComplete="off"
              isClearable
              showIcon
              selected={null}
              maxDate={maxDate || new Date()}
              minDate={minDate || new Date(1700, 0, 1)}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10.8889H22M17.5556 2V6.44444M6.44444 2V6.44444M6.86111 14.7944H8.00333M15.9967 14.7944H17.1389M11.4289 14.7944H12.5711M6.86111 18.2211H8.00333M15.9967 18.2211H17.1389M11.4289 18.2211H12.5711M17.5556 4.22222H6.44444C5.2657 4.22222 4.13524 4.69047 3.30175 5.52397C2.46825 6.35746 2 7.48793 2 8.66667V18.3889C2 19.5676 2.46825 20.6981 3.30175 21.5316C4.13524 22.3651 5.2657 22.8333 6.44444 22.8333H17.5556C18.7343 22.8333 19.8648 22.3651 20.6983 21.5316C21.5317 20.6981 22 19.5676 22 18.3889V8.66667C22 7.48793 21.5317 6.35746 20.6983 5.52397C19.8648 4.69047 18.7343 4.22222 17.5556 4.22222Z" stroke="#3C312B" strokeWidth="2.1875" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
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
    </FinalFormField>
  );
};

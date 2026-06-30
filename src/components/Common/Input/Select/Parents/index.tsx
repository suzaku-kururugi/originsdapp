import React, {
  FC,
  PropsWithChildren,
  SelectHTMLAttributes,
  useEffect,
} from "react";
import {
  useFormState,
  FieldProps as FinalFieldProps,
  useField,
} from "react-final-form";
import Select from "react-select";

import { selectStyles } from "../styles";
import { inputSelectStyles } from "../../styles";
import { Validate, getFieldValidators, dateToTimestamp } from "@/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  selectedOptions?: any[];
  validate?: Validate;
  onChange?: (event: any) => void;
}

type SelectPropsType = SelectProps &
  Omit<FinalFieldProps<string | number | boolean, any>, "validate">;

export const ParentsSelectInput: FC<PropsWithChildren<SelectPropsType>> = ({
  name,
  label,
  required,
  error,
  validate,
  options = [],
  onChange,
}) => {
  const { values: formValues } = useFormState();
  const { input, meta } = useField(name, {
    type: "select",
    multiple: true,
    validate: getFieldValidators(validate, formValues),
  });
  const childBirthDate = dateToTimestamp(formValues.dateOfBirth);

  useEffect(() => {
    if (!formValues.dateOfBirth) {
      input.onChange([]);
    }
  }, [formValues.dateOfBirth, input.onChange]);

  const transformedOptions = (options || []).map((option: any) => ({
    value: option.id,
    label: option.name,
    ...option
  }));

  const inputProps = {
    ...input,
    value: input.value !== undefined ? input.value : [],
    onChange: (ev: any) => {
      onChange?.(ev);
      input.onChange(ev);
    },
  };

  const hasError = error || (meta.error && meta.touched);
  const errorText = hasError ? `${meta.error?.[0]?.code}` : undefined;

  return (
    <div>
      <div className="field-label">
        {label}
        {!required ? null : <div className="mx-1 text-red-600">{"*"}</div>}
      </div>
      <Select
        // className={inputSelectStyles}
        styles={selectStyles}
        options={transformedOptions}
        isOptionDisabled={(option: any) => {
          // Disable field if user already select 2 parents
          // if (formValues.parents?.length >= 2) {
          //   return true;

          //   // Disable options where parent Date of Birth more than selected Birth Date in form
          // }
          if (option?.dateOfBirth >= childBirthDate) {
            return true;

            // Disable options where Date of Death more than selected Birth Date in form
            // else if(typeof option?.dd !== 'string') {
            //   return childBirthDate >= option.dd;

            // }
          } else {
            return false;
          }
        }}
        isDisabled={!formValues.dateOfBirth}
        isClearable
        isSearchable
        isMulti
        {...inputProps}
      />
      <div
        style={{
          fontSize: "x-small",
          height: "16px",
          color: "red",
          padding: "4px 0 0 10px",
        }}
      >
        {errorText}
      </div>
    </div>
  );
};

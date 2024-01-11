import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormOption } from "@/models/form-option";
import { IconType } from "react-icons";

interface RadioButtonsProps {
  label?: string;
  name: string;
  options: FormOption[];
  instantSubmit?;
}

function RadioButtons({
  label,
  options,
  instantSubmit,
  ...props
}: RadioButtonsProps): JSX.Element {
  return (
    <div>
      {label && <label>{label}:</label>}
      {options.map((option, index) => (
        <div key={index}>
          <Field
            type="radio"
            id={option.value}
            {...props}
            value={option.value}
            className={option.buttonStyling ? "hidden" : ""}
            onChange={(e) => instantSubmit(e)}
          />
          <label
            htmlFor={option.value.toString()}
            className={option.buttonStyling ? option.buttonStyling : ""}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg">{option.Icon && <option.Icon />}</div>
              {option.label}
            </div>
          </label>
        </div>
      ))}
      <div style={{ color: "red" }}>
        <ErrorMessage name={props.name} />
      </div>
    </div>
  );
}

export default RadioButtons;

import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormOption } from "@/models/form-option";

interface CheckBoxesProps {
  label?: string;
  name: string;
  options: FormOption[];
}

function CheckBoxes({
  label,
  options,
  ...props
}: CheckBoxesProps): JSX.Element {
  return (
    <div className="flex justify-evenly">
      {label && <label>{label}:</label>}
      {options.map((option, index) => (
        <div key={index}>
          <Field
            type="checkbox"
            id={option.value}
            {...props}
            value={option.value}
            className={option.buttonStyling ? "hidden" : ""}
          />
          <label
            htmlFor={option.value.toString()}
            className={option.buttonStyling ? option.buttonStyling : ""}
          >
            {option.label}
          </label>
        </div>
      ))}
      <ErrorMessage name={props.name} />
    </div>
  );
}

export default CheckBoxes;

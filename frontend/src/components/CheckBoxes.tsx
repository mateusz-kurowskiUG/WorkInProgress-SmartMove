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
  // const context = React.useContext(Field);
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
            className={(option.buttonStyling ? option.buttonStyling : "") + ``}
          >
            <div className="flex flex-col items-center justify-center text-md">
              <div className="text-3xl">{option.Icon && <option.Icon />}</div>
              {option.label}
            </div>
          </label>
        </div>
      ))}
      <ErrorMessage name={props.name} />
    </div>
  );
}

export default CheckBoxes;

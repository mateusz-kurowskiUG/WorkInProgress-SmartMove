import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormOption } from "@/models/form-option";
import { useRouteContext } from "@/contexts/route-context";

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
  const { chosenMeans } = useRouteContext();

  return (
    <div className="flex flex-col">
      <div className="flex py-2 justify-evenly">
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
              <div className="flex flex-col items-center justify-center text-md">
                <div className="text-3xl">{option.Icon && <option.Icon />}</div>
                {option.label}
              </div>
            </label>
          </div>
        ))}
      </div>
      <div style={{ color: "red" }}>
        <ErrorMessage name={props.name} />
      </div>
    </div>
  );
}

export default RadioButtons;

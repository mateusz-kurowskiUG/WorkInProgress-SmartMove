import { Field, ErrorMessage } from "formik";
import React from "react";

interface InputProps {
  label?: string;
  name: string;
  id?: string;
  type?: string;
  placeholder?: string;
}

function Input({ label, ...props }: InputProps): JSX.Element {
  return (
    <div>
      {label && <label htmlFor={props.name}>{label}: </label>}
      <Field
        id={props.id || props.name}
        {...props}
        className="input input-md"
      />
      <div style={{ color: "red" }}>
        <ErrorMessage name={props.name} />
      </div>
    </div>
  );
}

export default Input;

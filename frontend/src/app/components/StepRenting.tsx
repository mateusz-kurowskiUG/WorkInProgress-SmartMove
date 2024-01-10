import RadioButtons from "@/components/RadioButtons";
import { FormOption } from "@/models/form-option";
import { Form, Formik } from "formik";
import React from "react";

export default function StepRenting() {
  const isRentedOptions: FormOption[] = [
    { label: "Chcę wynająć", value: "false", buttonStyling: "btn btn-primary" },
    { label: "Wynajmuję", value: "true", buttonStyling: "btn btn-secondary" },
  ];

  const handleSubmit = (isRented) => {
    console.log(isRented.target.value);
  };

  return (
    <Formik
      initialValues={{
        isRented: "",
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <RadioButtons
          name="isRented"
          options={isRentedOptions}
          instantSubmit={handleSubmit}
        />
      </Form>
    </Formik>
  );
}

import RadioButtons from "@/components/RadioButtons";
import { useRouteContext } from "@/contexts/route-context";
import { FormOption } from "@/models/form-option";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

export default function StepRenting() {
  const { setIsRented } = useRouteContext();

  const isRentedOptions: FormOption[] = [
    { label: "Chcę wynająć", value: "false", buttonStyling: "btn btn-primary" },
    { label: "Wynajmuję", value: "true", buttonStyling: "btn btn-secondary" },
  ];

  const validationSchema = Yup.object({
    isRented: Yup.string().required(),
  });

  const handleSubmit = (isRented) => {
    setIsRented(isRented.target.value);
  };

  return (
    <Formik
      initialValues={{
        isRented: "",
      }}
      validationSchema={validationSchema}
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

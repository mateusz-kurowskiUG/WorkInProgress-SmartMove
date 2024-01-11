import RadioButtons from "@/components/RadioButtons";
import { useRouteContext } from "@/contexts/route-context";
import { useStepContext } from "@/contexts/step-context";
import { FormOption } from "@/models/form-option";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { GiAwareness } from "react-icons/gi";

export default function StepRenting() {
  const { setIsRented } = useRouteContext();
  const { setCurrStep } = useStepContext();

  console.log(MdOutlineDirectionsBike);

  const isRentedOptions: FormOption[] = [
    {
      label: "Chcę wynająć",
      value: "false",
      buttonStyling: "btn btn-primary wd-25 h-25 text-center",
      Icon: MdOutlineDirectionsBike,
    },
    {
      label: "Wynajmuję",
      value: "true",
      buttonStyling: "btn btn-secondary wd-25 h-25 text-center",
      Icon: GiAwareness,
    },
  ];

  const validationSchema = Yup.object({
    isRented: Yup.string().required(),
  });

  const handleSubmit = (isRented) => {
    setIsRented(isRented.target.value);
    setCurrStep(2);
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

import CheckBoxes from "@/components/CheckBoxes";
import { useRouteContext } from "@/contexts/route-context";
import { useStepContext } from "@/contexts/step-context";
import { Means } from "@/enums/means.enum";
import { FormOption } from "@/models/form-option";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { BsScooter } from "react-icons/bs";
import { MdPedalBike } from "react-icons/md";

export default function StepVehicle() {
  const { setChosenMeans } = useRouteContext();
  const { setCurrStep } = useStepContext();

  const meansOptions: FormOption[] = [
    {
      label: "Mevo",
      value: Means.MEVO,
      buttonStyling: "btn btn-primary flex-1",
      Icon: MdPedalBike,
    },
    {
      label: "Tier",
      value: Means.TIER,
      buttonStyling: "btn btn-secondary flex-1",
      Icon: BsScooter,
    },
  ];

  const handleSubmit = (values) => {
    setChosenMeans(values);
    setCurrStep(3);
  };

  const validationSchema = Yup.object().shape({
    chosenMeans: Yup.array()
      .min(1, "Wybierz przynajmniej jeden środek transportu")
      .required("Wybierz przynajmniej jeden środek transportu"),
  });

  return (
    <>
      <div className="text-center py-4 text-2xl">Wybierz środek transportu</div>
      <Formik
        initialValues={{
          chosenMeans: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="flex flex-col">
            <CheckBoxes name="chosenMeans" options={meansOptions} />
            <div className="grid place-items-center py-5">
              <button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className="btn btn-primary w-20"
              >
                Dalej
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

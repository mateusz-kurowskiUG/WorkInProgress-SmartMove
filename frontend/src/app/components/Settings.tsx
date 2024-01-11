"use client";

import React, { useState } from "react";
import StepRenting from "./StepRenting";
import StepRoute from "./StepRoute";
import StepVehicle from "./StepVehicle";
import { useStepContext } from "@/contexts/step-context";
import { useRouteContext } from "@/contexts/route-context";

export default function Settings() {
  const { currStep, setCurrStep } = useStepContext();
  const { isRented, chosenMeans } = useRouteContext();

  const steps = [
    {
      step: 1,
      component: StepRenting,
      text: "Czy wypożyczasz?",
      isValue: !!isRented,
    },
    {
      step: 2,
      component: StepVehicle,
      text: "Czym jedziesz?",
      isValue: !!chosenMeans,
    },
    {
      step: 3,
      component: StepRoute,
      text: "Trasa",
    },
  ];

  let CurrentStep = StepRenting;
  switch (currStep) {
    case 1:
      CurrentStep = StepRenting;
      break;
    case 2:
      CurrentStep = StepVehicle;
      break;
    case 3:
      CurrentStep = StepRoute;
      break;

    default:
      CurrentStep = StepRenting;
      break;
  }

  return (
    <div>
      <div className="steps text-xs flex ">
        {steps.map((step) => (
          <button
            key={step.step}
            className={`flex-1 step ${
              step.step <= currStep
                ? step.isValue
                  ? "step-primary"
                  : "step-error"
                : ""
            }`}
            onClick={() => setCurrStep(step.step)}
          >
            {step.text}
          </button>
        ))}
      </div>
      <CurrentStep />
    </div>
  );
}

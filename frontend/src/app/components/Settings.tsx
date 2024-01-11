"use client";

import React, { useState } from "react";
import StepRenting from "./StepRenting";
import StepRoute from "./StepRoute";
import StepVehicle from "./StepVehicle";
import { useStepContext } from "@/contexts/step-context";

export default function Settings() {
  const { currStep, setCurrStep } = useStepContext();

  const steps = [
    {
      step: 1,
      component: StepRenting,
      text: "Czy wypożyczasz?",
    },
    {
      step: 2,
      component: StepVehicle,
      text: "Czym jedziesz?",
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
    <div className="bg-slate-800 absolute z-10">
      <div className="steps text-xs flex justify-center">
        {steps.map((step) => (
          <button
            key={step.step}
            className={`step ${step.step <= currStep ? "step-primary" : ""}`}
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

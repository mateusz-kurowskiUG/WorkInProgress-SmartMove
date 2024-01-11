"use client";

import { createContext, useContext, useState } from "react";

interface StepContextProviderProps {
  children: React.ReactNode;
}

interface StepContextType {
  currStep: number;
  setCurrStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepContext = createContext<StepContextType | null>(null);

export const useStepContext = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used within a StepContextProvider");
  }
  return context;
};

export default function StepContextProvider({
  children,
}: StepContextProviderProps): JSX.Element {
  const [currStep, setCurrStep] = useState<number>(1);

  return (
    <StepContext.Provider
      value={{
        currStep,
        setCurrStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

'use client';

import React, { useState } from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";

interface MultiStepFormProps<TIn extends FieldValues, TOut extends FieldValues = TIn> {
  methods: UseFormReturn<TIn, any, TOut>;
  onSubmit: (data: TOut) => void;
  steps: Array<React.ElementType>;

  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  stepProps?: Record<string, any>;
}

export function MultiStepForm<TIn extends FieldValues, TOut extends FieldValues = TIn>({
  methods,
  onSubmit,
  steps,
  currentStep,
  setCurrentStep,
  stepProps
}: MultiStepFormProps<TIn, TOut>) {
  const [internalStep, setInternalStep] = useState(0);

  const step = currentStep ?? internalStep;
  const setStep = setCurrentStep ?? setInternalStep;

  const totalSteps = steps.length;

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  const CurrentStepComponent = steps[step];

  return (
    <>
      {totalSteps > 1 && <ProgressBar progress={((step + 1) / totalSteps) * 100} color="inherit" />}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CurrentStepComponent 
            onNext={next} 
            onBack={back} 
            isLastStep={currentStep === totalSteps - 1} 
            {...stepProps}
          />
        </form>
      </FormProvider>
    </>
  );
}
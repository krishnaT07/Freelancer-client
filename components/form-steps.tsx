
'use client';

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormStepsProps {
    steps: { id: number; name: string }[];
    currentStep: number;
}

export function FormSteps({ steps, currentStep }: FormStepsProps) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                    {currentStep > step.id ? (
                    <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-primary transition-colors ">
                        {step.id}. {step.name}
                        </span>
                    </div>
                    ) : currentStep === step.id ? (
                    <div
                        className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        aria-current="step"
                    >
                        <span className="text-sm font-medium text-primary">
                        {step.id}. {step.name}
                        </span>
                    </div>
                    ) : (
                    <div className="group flex w-full flex-col border-l-4 border-border py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-muted-foreground transition-colors">
                        {step.id}. {step.name}
                        </span>
                    </div>
                    )}
                </li>
                ))}
            </ol>
        </nav>
    )
}

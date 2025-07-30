import React from "react";

const steps = [
  { label: "Sepet", icon: "🛒" },
  { label: "Ödeme", icon: "💳" },
];

const StepBar = ({ currentStep = 0, onStepChange }) => {
  return (
    <div className="w-full flex flex-col items-center mb-8 select-none">
      <div className="flex items-center w-full max-w-md mx-auto">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <button
              className={`flex flex-col items-center focus:outline-none transition group ${idx === currentStep ? "text-[#6C2BD7]" : "text-gray-400"}`}
              onClick={() => onStepChange && onStepChange(idx)}
              disabled={idx > currentStep + 1}
            >
              <span className={`text-2xl mb-1 transition-all duration-300 ${idx === currentStep ? "scale-125" : "scale-100"}`}>{step.icon}</span>
              <span className="text-xs font-semibold tracking-wide">{step.label}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2" />
                <div
                  className={`absolute top-1/2 left-0 h-1 rounded-full transition-all duration-500 ${currentStep > idx ? "bg-[#6C2BD7] w-full" : currentStep === idx ? "bg-[#6C2BD7] w-1/2" : "bg-gray-200 w-0"}`}
                  style={{ transform: "translateY(-50%)" }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepBar; 
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

import StepService from "./step-service";
import StepProfessional from "./step-professional";
import StepDate from "./step-date";
import StepTime from "./step-time";
import StepDetails from "./step-details";
import StepSummary from "./step-summary";
import StepConfirmation from "./step-confirmation";

const steps = [
  "Serviço",
  "Profissional",
  "Data",
  "Horário",
  "Dados",
  "Resumo",
  "Confirmação"
];

export default function BookingStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({});
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const updateData = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
  };

  const handleConfirm = () => {
    // API Call goes here
    handleNext();
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {currentStep < steps.length - 1 && (
        <div className="bg-black border-b border-border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Passo {currentStep + 1} de {steps.length - 1}</h3>
            <span className="text-accent font-medium">{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-accent h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / (steps.length - 2)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 p-6 md:p-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 0 && <StepService data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 1 && <StepProfessional data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 2 && <StepDate data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 3 && <StepTime data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 4 && <StepDetails data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 5 && <StepSummary data={bookingData} onEdit={setCurrentStep} onConfirm={handleConfirm} />}
            {currentStep === 6 && <StepConfirmation data={bookingData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep < steps.length - 2 && (
        <div className="border-t border-border p-6 bg-black flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <Button 
            onClick={handleNext}
            className="flex items-center"
          >
            Próximo <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

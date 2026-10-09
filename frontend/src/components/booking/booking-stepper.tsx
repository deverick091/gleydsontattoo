"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import { bookingService } from "@/services/booking.service";
import { BookingData } from "@/types";

import StepService from "./step-service";
import StepDate from "./step-date";
import StepTime from "./step-time";
import StepDetails from "./step-details";
import StepSummary from "./step-summary";
import StepConfirmation from "./step-confirmation";

const steps = [
  "Serviço",
  "Data",
  "Horário",
  "Dados",
  "Resumo",
  "Confirmação"
];

const initialBookingData: BookingData = {
  serviceId: "",
  serviceName: "",
  professionalId: "",
  professionalName: "",
  selectedDate: "",
  selectedTime: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  notes: ""
};

export default function BookingStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadDefaultProfessional() {
      try {
        const professionals = await bookingService.getProfessionals();
        if (professionals && professionals.length > 0) {
          setBookingData(prev => ({
            ...prev,
            professionalId: professionals[0].id,
            professionalName: professionals[0].name
          }));
        }
      } catch (error) {
        console.error("Failed to load professional:", error);
      }
    }
    loadDefaultProfessional();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const updateData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleConfirm = async () => {
    if (!bookingData.serviceId || !bookingData.selectedDate || !bookingData.selectedTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);

      await bookingService.createAppointment({
        professionalId: bookingData.professionalId,
        serviceId: bookingData.serviceId,
        date: bookingData.selectedDate,
        startTime: bookingData.selectedTime,
        client: {
          name: bookingData.clientName,
          phone: bookingData.clientPhone,
          whatsapp: bookingData.clientPhone,
          email: bookingData.clientEmail,
          notes: bookingData.notes,
        },
      });

      toast.success("Agendamento confirmado com sucesso!");
      handleNext();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erro ao confirmar agendamento";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
            {currentStep === 1 && <StepDate data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 2 && <StepTime data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 3 && <StepDetails data={bookingData} updateData={updateData} onNext={handleNext} />}
            {currentStep === 4 && <StepSummary data={bookingData} onEdit={setCurrentStep} onConfirm={handleConfirm} isSubmitting={isSubmitting} />}
            {currentStep === 5 && <StepConfirmation data={bookingData} />}
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

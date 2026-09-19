import { Metadata } from "next";
import BookingStepper from "@/components/booking/booking-stepper";
import SectionHeader from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Agendar Horário | Gleydson Tattoo",
  description: "Agende sua sessão de tatuagem ou piercing de forma rápida e prática.",
};

export default function AgendamentoPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <SectionHeader title="Agendar Horário" subtitle="Preencha os passos abaixo para garantir seu horário." />
        <div className="max-w-4xl mx-auto mt-12 bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-2xl">
          <BookingStepper />
        </div>
      </div>
    </div>
  );
}

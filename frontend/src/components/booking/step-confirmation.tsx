"use client";

import { motion } from "framer-motion";
import { CheckCircle, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingData } from "@/types";

interface StepConfirmationProps {
  data: BookingData;
}

export default function StepConfirmation({ data }: StepConfirmationProps) {
  const dateFormatted = data.selectedDate
    ? format(new Date(data.selectedDate), "dd/MM/yyyy", { locale: ptBR })
    : "";

  const textToShare = encodeURIComponent(
    `Olá! Meu agendamento está confirmado:\n\nServiço: ${data.serviceName}\nProfissional: ${data.professionalName}\nData: ${dateFormatted} às ${data.selectedTime}\n\nObrigado!`
  );

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591999999999";

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-8 h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <CheckCircle className="w-24 h-24 text-success mb-4" />
      </motion.div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-accent mb-3"
        >
          Agendamento Realizado!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted text-lg max-w-md mx-auto"
        >
          Olá {data.clientName}, recebemos seu pedido de agendamento.
          Te enviaremos uma mensagem no WhatsApp em breve.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-sm flex items-center gap-4 text-left"
      >
        <div className="bg-zinc-900 p-3 rounded-full text-accent">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted mb-1">Data e Hora</p>
          <p className="text-white font-bold">{dateFormatted} às {data.selectedTime}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8"
      >
        <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20b858] text-white">
          <a href={`https://wa.me/${whatsappNumber}?text=${textToShare}`} target="_blank" rel="noopener noreferrer">
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar no WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </motion.div>
    </div>
  );
}

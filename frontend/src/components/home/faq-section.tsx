"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";

const faqs = [
  {
    q: "Dói muito fazer tatuagem?",
    a: "A dor é relativa e varia de pessoa para pessoa, além da região do corpo escolhida. Utilizamos técnicas que minimizam o desconforto, tornando a experiência o mais tranquila possível."
  },
  {
    q: "Quanto tempo dura a sessão?",
    a: "Depende do tamanho e complexidade do desenho. Trabalhos pequenos podem levar 1 hora, enquanto projetos maiores podem exigir várias sessões de 4 a 6 horas."
  },
  {
    q: "Posso levar minhas referências?",
    a: "Com certeza! É fundamental trazer referências para que possamos entender seu gosto e criar um design exclusivo baseado nas suas ideias."
  },
  {
    q: "Quais os cuidados pós-tatuagem?",
    a: "Você receberá uma cartilha detalhada. Em resumo: manter a região limpa, usar a pomada indicada, evitar sol, mar e piscina nos primeiros 15 dias, e não coçar."
  },
  {
    q: "Aceitam menores de idade?",
    a: "Por lei, realizamos procedimentos apenas em maiores de 18 anos. Em alguns casos específicos, aceitamos menores a partir de 16 anos com autorização registrada em cartório e presença dos pais."
  },
  {
    q: "Qual a forma de pagamento?",
    a: "Aceitamos Pix, dinheiro, cartões de crédito e débito. Projetos grandes podem ser parcelados no cartão de crédito."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader title="Perguntas Frequentes" />
        
        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 transition-colors ${isOpen ? 'border-l-4 border-l-accent' : ''}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-bold text-lg ${isOpen ? 'text-accent' : 'text-white'}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted shrink-0"
                  >
                    {isOpen ? <Minus /> : <Plus />}
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-muted leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

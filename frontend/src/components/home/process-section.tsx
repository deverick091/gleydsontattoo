"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/section-header";
import { MessageSquare, PenTool, Syringe, Heart } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Consulta",
    desc: "Conte-nos sua ideia e referências",
    icon: MessageSquare
  },
  {
    num: "02",
    title: "Design",
    desc: "Criamos o design perfeito para você",
    icon: PenTool
  },
  {
    num: "03",
    title: "Execução",
    desc: "Realizamos o procedimento com segurança",
    icon: Syringe
  },
  {
    num: "04",
    title: "Cuidados",
    desc: "Orientações para cicatrização perfeita",
    icon: Heart
  }
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-zinc-900 border-y border-border relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader title="Como Funciona" />

        <div className="mt-20 relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-800">
            <div className="h-full bg-accent w-full origin-left scale-x-0 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-black border-2 border-accent flex items-center justify-center relative z-10 mb-6 group hover:scale-110 transition-transform">
                  <span className="absolute -top-4 bg-black px-2 text-accent font-bold text-sm">
                    {step.num}
                  </span>
                  <step.icon className="w-10 h-10 text-white group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

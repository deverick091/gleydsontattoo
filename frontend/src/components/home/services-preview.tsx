"use client";

import { motion } from "framer-motion";
import { Droplet, Ear, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/shared/section-header";

const services = [
  {
    icon: Droplet,
    title: "Tatuagem",
    description: "Trabalhos exclusivos e personalizados em diversos estilos (Realismo, Blackwork, Fine Line, Old School).",
  },
  {
    icon: Ear,
    title: "Piercing",
    description: "Perfurações seguras e assépticas com joias de alta qualidade em titânio e aço cirúrgico.",
  },
  {
    icon: Calculator,
    title: "Orçamento",
    description: "Consulte o valor do seu projeto antes de agendar, sem compromisso.",
  },
];

export default function ServicesPreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <SectionHeader title="Nossos Serviços" subtitle="Excelência e biossegurança em todos os procedimentos." />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-zinc-900 border border-zinc-800 hover:border-accent p-8 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              <service.icon className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-muted leading-relaxed mb-6">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link href="/servicos" className="inline-flex items-center text-accent hover:text-white transition-colors font-medium text-lg">
            Ver todos os serviços <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

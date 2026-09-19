"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase">
              Sobre o Estúdio
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full" />
            
            <div className="text-lg text-muted space-y-4">
              <p>
                Fundado com a missão de elevar a arte da tatuagem, o Gleydson Tattoo é um espaço dedicado à criação de obras únicas e personalizadas para cada cliente.
              </p>
              <p>
                Nosso compromisso é com a excelência técnica, biossegurança rigorosa e um atendimento que transforma sua ideia em uma experiência memorável.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
              <div>
                <p className="text-3xl font-bold text-accent">8+</p>
                <p className="text-sm text-muted uppercase tracking-wider mt-1">Anos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">2000+</p>
                <p className="text-sm text-muted uppercase tracking-wider mt-1">Trabalhos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">98%</p>
                <p className="text-sm text-muted uppercase tracking-wider mt-1">Satisfação</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-xl overflow-hidden bg-zinc-900 border border-border"
          >
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              [Imagem do Estúdio / Tatuador]
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

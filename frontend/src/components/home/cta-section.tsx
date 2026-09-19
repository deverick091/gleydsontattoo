"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-zinc-950 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent z-10" />
      
      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
            Pronto para marcar <span className="text-accent">sua história?</span>
          </h2>
          <p className="text-xl text-muted">
            Agende seu horário e transforme sua ideia em arte.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
              <Link href="/agendamento">Agendar Horário</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
              <Link href="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

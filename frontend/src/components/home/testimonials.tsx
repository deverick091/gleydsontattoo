"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";

const testimonials = [
  {
    name: "Ana Silva",
    text: "Profissionalismo impecável! O Gleydson conseguiu captar perfeitamente a essência do que eu queria. O traço é finíssimo e o cuidado com a higiene me deixou muito segura.",
    service: "Fine Line",
    rating: 5
  },
  {
    name: "Rafael Costa",
    text: "Melhor estúdio que já visitei. O ambiente é super agradável e o realismo da minha tatuagem ficou absurdo. Recomendo de olhos fechados.",
    service: "Realismo",
    rating: 5
  },
  {
    name: "Juliana Santos",
    text: "Fiz meu primeiro piercing aqui e a experiência foi ótima. Zero dor, cicatrização perfeita e a joia é linda. Voltarei com certeza!",
    service: "Piercing",
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader title="O Que Nossos Clientes Dizem" />
        
        <div className="max-w-4xl mx-auto mt-16 relative">
          <Quote className="absolute -top-6 -left-6 w-16 h-16 text-accent opacity-20" />
          
          <div className="overflow-hidden min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900/50 p-8 md:p-12 rounded-2xl border border-zinc-800"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl font-medium text-white mb-8 italic">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div>
                  <h4 className="text-lg font-bold text-accent">{testimonials[currentIndex].name}</h4>
                  <p className="text-muted text-sm">{testimonials[currentIndex].service}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-accent" : "bg-zinc-700"
                }`}
                aria-label={`Ver depoimento ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

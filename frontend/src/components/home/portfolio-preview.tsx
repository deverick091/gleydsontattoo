"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";

export default function PortfolioPreview() {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <SectionHeader title="Trabalhos Recentes" subtitle="Conheça alguns dos nossos projetos mais recentes." />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-16">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-square bg-zinc-800 rounded-lg overflow-hidden cursor-pointer"
            >
              {/* Placeholder image representation */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                Imagem {item}
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 border-2 border-transparent group-hover:border-accent rounded-lg">
                <h4 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">Projeto {item}</h4>
                <p className="text-accent text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">Blackwork</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/portfolio" className="inline-flex items-center text-accent hover:text-white transition-colors font-medium text-lg">
            Ver Portfólio Completo <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

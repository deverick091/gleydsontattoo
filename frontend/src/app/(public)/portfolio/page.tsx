"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/shared/section-header";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["Todos", "Blackwork", "Fine Line", "Old School", "Realismo", "Piercing"];

const ITEMS = [
  { id: 1, category: "Realismo", src: "/portfolio/1.jpg", title: "Leão Realista" },
  { id: 2, category: "Blackwork", src: "/portfolio/2.jpg", title: "Mandala Blackwork" },
  { id: 3, category: "Fine Line", src: "/portfolio/3.jpg", title: "Floral Fine Line" },
  { id: 4, category: "Piercing", src: "/portfolio/4.jpg", title: "Septo Titânio" },
  { id: 5, category: "Old School", src: "/portfolio/5.jpg", title: "Andorinha Old School" },
  { id: 6, category: "Blackwork", src: "/portfolio/6.jpg", title: "Geométrico Blackwork" },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const filteredItems = activeFilter === "Todos" 
    ? ITEMS 
    : ITEMS.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4">
        <SectionHeader title="Nosso Portfólio" subtitle="Explore a arte gravada na pele." />

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === cat 
                  ? "bg-accent text-black" 
                  : "border border-zinc-800 text-white hover:border-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-900 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  [Imagem: {item.title}]
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-accent" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 text-white hover:text-accent transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full max-w-4xl aspect-square md:aspect-video bg-zinc-900 rounded-lg flex items-center justify-center text-muted">
              [Visualização em alta resolução: {selectedImage.title}]
              <div className="absolute bottom-6 left-6 text-left">
                <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-accent">{selectedImage.category}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/section-header";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocationSection() {
  return (
    <section className="py-24 bg-zinc-900 border-t border-border">
      <div className="container mx-auto px-4">
        <SectionHeader title="Localização" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-black p-8 md:p-12 rounded-2xl border border-zinc-800 flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Endereço</h4>
                  <p className="text-muted">R. Domingos Silva, 84<br />Barcarena, PA — 68445-000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Horário de Funcionamento</h4>
                  <ul className="text-muted space-y-1">
                    <li>Segunda a Sábado: 09:00 – 18:00</li>
                    <li>Domingo: Fechado</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Contato</h4>
                  <p className="text-muted">(91) 99999-9999</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" size="lg" onClick={() => window.open('https://maps.google.com', '_blank')}>
                <Navigation className="mr-2 w-5 h-5" />
                Como Chegar
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Falar no WhatsApp
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden border-2 border-accent min-h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4619478440787!2d-48.62584!3d-1.54848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a460a87a1d1d87%3A0x9a84a6a6a!2sR.%20Domingos%20Silva%2C%2084%20-%20Barcarena%2C%20PA%2C%2068445-000!5e0!3m2!1spt-BR!2sbr!4v1690000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

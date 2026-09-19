import { Metadata } from "next";
import SectionHeader from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = { title: "Serviços | Gleydson Tattoo" };

const services = [
  {
    title: "Tatuagem Exclusiva",
    desc: "Criação de artes exclusivas e aplicação com rigor técnico e artístico.",
    duration: "A partir de 1h",
    price: "Sob orçamento",
    features: ["Desenho personalizado", "Materiais descartáveis e premium", "Acompanhamento de cicatrização"]
  },
  {
    title: "Piercing",
    desc: "Perfurações corporais assépticas com joalheria de alta biocompatibilidade.",
    duration: "30 min",
    price: "A partir de R$ 80",
    features: ["Joias em Titânio ou Aço Cirúrgico", "Técnica asséptica", "Guia de cuidados pós"]
  }
];

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4">
        <SectionHeader title="Nossos Serviços" subtitle="Conheça em detalhes o que oferecemos." />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
          {services.map((service, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col h-full hover:border-accent transition-colors">
              <h3 className="text-3xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-muted text-lg mb-6">{service.desc}</p>
              
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Duração</span>
                  <span className="text-white font-medium">{service.duration}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Valor</span>
                  <span className="text-accent font-medium">{service.price}</span>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h4 className="text-white font-medium mb-4">O que inclui:</h4>
                <ul className="space-y-3">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-accent mr-3 shrink-0" />
                      <span className="text-muted">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button asChild className="w-full h-12 text-lg">
                <Link href="/agendamento">Agendar {service.title}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

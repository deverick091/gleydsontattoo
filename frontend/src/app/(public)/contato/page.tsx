import { Metadata } from "next";
import SectionHeader from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Instagram, Send } from "lucide-react";

export const metadata: Metadata = { title: "Contato | Gleydson Tattoo" };

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4">
        <SectionHeader title="Fale Conosco" subtitle="Tire suas dúvidas ou faça um orçamento." />

        <div className="grid lg:grid-cols-2 gap-12 mt-16 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent"><Phone className="w-6 h-6" /></div>
                <div>
                  <p className="text-white font-medium">WhatsApp</p>
                  <p className="text-muted">(91) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent"><Instagram className="w-6 h-6" /></div>
                <div>
                  <p className="text-white font-medium">Instagram</p>
                  <p className="text-muted">@gleydsontattoo</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 rounded-full text-accent"><MapPin className="w-6 h-6" /></div>
                <div>
                  <p className="text-white font-medium">Endereço</p>
                  <p className="text-muted">R. Domingos Silva, 84 - Barcarena, PA</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4619478440787!2d-48.62584!3d-1.54848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a460a87a1d1d87%3A0x9a84a6a6a!2sR.%20Domingos%20Silva%2C%2084%20-%20Barcarena%2C%20PA%2C%2068445-000!5e0!3m2!1spt-BR!2sbr!4v1690000000000!5m2!1spt-BR!2sbr"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className="bg-zinc-900 border border-border p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h3>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Nome</label>
                <Input placeholder="Seu nome completo" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">WhatsApp</label>
                  <Input placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Mensagem</label>
                <Textarea placeholder="Como podemos ajudar?" className="h-32" />
              </div>
              <Button className="w-full h-12 mt-4 text-lg">
                <Send className="w-5 h-5 mr-2" /> Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

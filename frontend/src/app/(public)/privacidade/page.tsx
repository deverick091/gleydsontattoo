import { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade | Gleydson Tattoo" };

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-4xl prose prose-invert">
        <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
        <p className="text-muted">Última atualização: Setembro de 2026</p>
        
        <div className="mt-8 space-y-6 text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Coleta de Dados</h2>
            <p>Coletamos dados pessoais (nome, telefone, email) apenas para fins de agendamento e contato profissional no âmbito do estúdio de tatuagem.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Uso dos Dados</h2>
            <p>Seus dados são utilizados exclusivamente para confirmar horários, enviar orçamentos e prestar o serviço contratado. Não compartilhamos informações com terceiros sem sua autorização explícita.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Imagens e Portfólio</h2>
            <p>Fotos do procedimento ou da tatuagem finalizada só serão publicadas em nossas redes sociais ou site mediante sua autorização verbal ou escrita no dia da sessão.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

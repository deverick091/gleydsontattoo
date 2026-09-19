import { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Serviço | Gleydson Tattoo" };

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-4xl prose prose-invert">
        <h1 className="text-4xl font-bold text-white mb-8">Termos de Serviço</h1>
        <p className="text-muted">Última atualização: Setembro de 2026</p>
        
        <div className="mt-8 space-y-6 text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agendamentos e Sinal</h2>
            <p>Para confirmar qualquer agendamento, é exigido o pagamento de um sinal (valor estipulado pelo estúdio). Este sinal é descontado do valor total da sessão. Em caso de cancelamento com menos de 48h de antecedência, o sinal não será reembolsado.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Idade Mínima</h2>
            <p>Realizamos procedimentos exclusivamente em maiores de 18 anos. Menores a partir de 16 anos apenas com a presença física e autorização legal dos responsáveis.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cuidados e Cicatrização</h2>
            <p>O resultado final e cicatrização da tatuagem/piercing dependem diretamente dos cuidados pós-procedimento realizados pelo cliente. O estúdio não se responsabiliza por problemas oriundos de negligência nos cuidados indicados.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-xl tracking-widest">
          <span className="text-accent">GLEYDSON</span>
          <span className="text-white">TATTOO</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/" className="hover:text-accent transition">Início</a>
          <a href="/portfolio" className="hover:text-accent transition">Portfólio</a>
          <a href="/servicos" className="hover:text-accent transition">Serviços</a>
          <a href="/agendamento" className="hover:text-accent transition">Agendamento</a>
          <a href="/contato" className="hover:text-accent transition">Contato</a>
        </nav>
      </div>
    </header>
  );
}

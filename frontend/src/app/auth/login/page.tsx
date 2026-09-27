"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@gleydsontattoo.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const performLogin = (customEmail?: string) => {
    setLoading(true);
    login("mock-token-" + Date.now(), {
      id: "1",
      name: "Gleydson",
      email: customEmail || email || "admin@gleydsontattoo.com",
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success("Login realizado com sucesso!");
    router.replace("/admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Button variant="ghost" asChild className="text-zinc-400 hover:text-white">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o site
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-widest text-white uppercase hover:opacity-90 transition">
              <span className="text-accent">GLEYDSON</span> TATTOO
            </h1>
          </Link>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Painel de Gestão do Estúdio</p>
        </div>

        <Card className="border-border bg-zinc-950">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/30 mx-auto mb-2 text-accent">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Faça login para gerenciar agendamentos, clientes, orçamentos e serviços.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-zinc-900/80 border border-accent/30 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-accent font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Credenciais de Demonstração</span>
              </div>
              <p className="text-zinc-300">
                E-mail: <strong className="text-white">admin@gleydsontattoo.com</strong>
              </p>
              <p className="text-zinc-300">
                Senha: <strong className="text-white">admin123</strong>
              </p>
            </div>

            <Button
              type="button"
              onClick={() => performLogin()}
              disabled={loading}
              className="w-full h-11 text-base bg-accent text-black hover:bg-accent/90 font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Entrar como Administrador (1 Clique)
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-xs text-zinc-500 uppercase">ou preencha os dados</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">E-mail</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gleydsontattoo.com"
                  required
                  className="h-11 bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Senha</label>
                  <span className="text-xs text-accent">Qualquer senha é válida</span>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full h-11 text-base border-zinc-700 text-white hover:bg-zinc-800"
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar com Credenciais"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api';
import { User } from '@/types';

type LoginResponse = { user: User; token: string };

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    try {
      const response = await api.post<{ data: LoginResponse }>('/api/auth/login', {
        email: form.get('email'),
        password: form.get('password'),
      });
      localStorage.setItem('accessToken', response.data.token);
      router.replace('/admin');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase"><span className="text-accent">GLEYDSON</span> TATTOO</h1>
        </div>
        <Card className="border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Acesso Restrito</CardTitle>
            <CardDescription className="text-center">Insira suas credenciais para acessar o painel administrativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                <Input id="email" name="email" type="email" autoComplete="username" required className="h-12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">Senha</label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-12" />
              </div>
              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
                {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

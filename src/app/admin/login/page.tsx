'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const ADMIN_EMAIL = 'josineisilva2@gmail.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (email !== ADMIN_EMAIL) {
        setError('Acesso negado. Somente administradores.');
        setIsLoading(false);
        return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success: onAuthStateChanged will trigger redirect in useEffect
    } catch (err: any) {
      setError('Falha no login. Verifique seu e-mail e senha.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (!isUserLoading && user) {
        if (user.email === ADMIN_EMAIL) {
            router.push('/admin');
        }
    }
  }, [user, isUserLoading, router]);


  if (isUserLoading || (!isUserLoading && user?.email === ADMIN_EMAIL)) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Acesso Restrito
          </CardTitle>
          <CardDescription className="text-gray-400">
            Faça login para acessar o painel de administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="seuemail@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="********"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-400 hover:underline">
                Voltar para a página principal
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

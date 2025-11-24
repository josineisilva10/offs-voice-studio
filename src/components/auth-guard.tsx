'use client';

import { useUser } from '@/firebase/provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Rotas que não exigem autenticação
const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      // Não faça nada enquanto o estado de autenticação está carregando
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      // Se o usuário não está logado e a rota não é pública, redireciona para o login
      router.push('/login');
    } else if (user && isPublicRoute) {
      // Se o usuário está logado e tentando acessar uma rota pública (ex: /login), redireciona para o painel
      router.push('/');
    }
  }, [user, isUserLoading, router, pathname]);

  // Se estiver carregando ou se o usuário não estiver autenticado em uma rota não pública,
  // mostra uma tela de carregamento para evitar exibir conteúdo protegido rapidamente.
  if (isUserLoading || (!user && !PUBLIC_ROUTES.includes(pathname))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Se o usuário estiver logado e tentando acessar login, o useEffect já vai redirecionar,
  // mas podemos retornar null para evitar um flash de conteúdo.
  if(user && PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  // Se tudo estiver certo (usuário logado em rota protegida ou anônimo em rota pública),
  // renderiza o conteúdo da página.
  return <>{children}</>;
}

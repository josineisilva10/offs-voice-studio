'use client';

import { useMemo } from 'react';
import { doc, DocumentReference } from 'firebase/firestore';
import { useDoc, useFirestore, useUser } from '@/firebase';

import { MainLayout } from '@/components/layout/main-layout';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define o tipo para o perfil do usuário para garantir a segurança de tipos
interface UserProfile {
  credits: number;
  // Adicione outros campos do perfil do usuário aqui conforme necessário
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Cria uma referência ao documento do usuário no Firestore.
  // `useMemo` garante que a referência não seja recriada em cada renderização,
  // evitando loops infinitos e leituras desnecessárias do banco de dados.
  const userDocRef = useMemo(() => {
    if (user?.uid && firestore) {
      return doc(
        firestore,
        'users',
        user.uid
      ) as DocumentReference<UserProfile>;
    }
    return undefined;
  }, [user?.uid, firestore]);

  // Busca os dados do documento do usuário em tempo real.
  const { data: userProfile, isLoading } = useDoc<UserProfile>(userDocRef);

  return (
    <MainLayout>
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">Painel Principal</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel! Aqui você tem acesso rápido a todas as
          funcionalidades.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Créditos</CardTitle>
              <CardDescription>
                {/* Exibe 'Carregando...' enquanto os dados não chegam, 
                    depois mostra os créditos do usuário ou 0 se não houver perfil. */}
                {isLoading ? 'Carregando...' : userProfile?.credits ?? 0}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Realizados</CardTitle>
              <CardDescription>0</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vozes Favoritas</CardTitle>
              <CardDescription>0</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>0</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

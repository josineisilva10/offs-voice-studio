'use client';

import React from 'react';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileAudio } from 'lucide-react';

interface Order {
  id: string;
  orderDate: string;
  locutor: string;
  estiloGravacao: string;
  estiloLocucao: string;
  tipoGravacao: string;
  texto: string;
  tempoEstimado: number;
  totalAmount: number;
  instrucoes: string;
  audioReferenciaUrl?: string;
  trilhaSonoraUrl?: string;
  status: 'pending' | 'completed';
}

const OrderCard = ({ order }: { order: Order }) => {
  const formattedDate = new Date(order.orderDate).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Pedido de {order.locutor}</CardTitle>
            <CardDescription className="text-gray-400">{formattedDate}</CardDescription>
          </div>
          <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
            {order.status === 'pending' ? 'Pendente' : 'Feito'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-300">Texto para Gravação:</h4>
          <p className="text-gray-400 bg-gray-900 p-3 rounded-md whitespace-pre-wrap">{order.texto || 'N/A'}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-300">Estilo de Gravação</h4>
            <p className="text-gray-400">{order.estiloGravacao}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300">Estilo de Locução</h4>
            <p className="text-gray-400">{order.estiloLocucao}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300">Tipo de Gravação</h4>
            <p className="text-gray-400">{order.tipoGravacao}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300">Duração Estimada</h4>
            <p className="text-gray-400">{order.tempoEstimado} seg</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300">Valor Total</h4>
            <p className="text-green-400 font-bold">{order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300">Arquivos</h4>
            <div className="flex flex-col space-y-2">
              {order.audioReferenciaUrl ? (
                <a href={order.audioReferenciaUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center">
                  <FileAudio className="mr-2 h-4 w-4" /> Ouvir Áudio de Referência
                </a>
              ) : (
                <span className="text-gray-500">Sem áudio de referência</span>
              )}
              {order.trilhaSonoraUrl ? (
                <a href={order.trilhaSonoraUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center">
                  <FileAudio className="mr-2 h-4 w-4" /> Ouvir Trilha Sonora
                </a>
              ) : (
                 <span className="text-gray-500">Sem trilha sonora</span>
              )}
            </div>
          </div>
        </div>
        {order.instrucoes && (
          <div>
            <h4 className="font-semibold text-gray-300">Instruções Adicionais:</h4>
            <p className="text-gray-400">{order.instrucoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function HistoricoPage() {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const ordersQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/orders`),
      orderBy('orderDate', 'desc')
    );
  }, [user, firestore]);

  const { data: orders, isLoading, error } = useCollection<Order>(ordersQuery);

  if (isUserLoading || isLoading) {
    return <div className="text-center text-white p-10">Carregando histórico...</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-white p-10">
        <p>Você precisa estar logado para ver o histórico.</p>
        <p className="text-sm text-gray-400">(O login é automático e anônimo ao visitar a página principal)</p>
        <Link href="/" className="text-purple-400 hover:underline mt-4 inline-block">
          Voltar para a página principal
        </Link>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-10">Erro ao carregar o histórico: {error.message}</div>;
  }
  

  return (
    <div className="text-white min-h-screen">
       <div className="container mx-auto p-4 md:p-8">
         <header className="text-center my-8 md:my-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Histórico de Pedidos
            </h1>
            <p className="text-lg text-gray-300 mt-2">
                Todos os pedidos recebidos, do mais recente ao mais antigo.
            </p>
            <Link href="/" className="text-purple-400 hover:underline mt-4 inline-block">
                ← Voltar para a página principal
            </Link>
         </header>

        <main className="space-y-6">
            {orders && orders.length > 0 ? (
                orders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
                <div className="text-center text-gray-400 p-10 bg-gray-800 rounded-lg">
                    <p>Nenhum pedido encontrado ainda.</p>
                </div>
            )}
        </main>
       </div>
    </div>
  );
}

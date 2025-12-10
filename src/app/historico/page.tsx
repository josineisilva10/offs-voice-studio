'use client';

import React from 'react';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Music, Loader2 } from 'lucide-react';

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
  musicaYoutube?: string;
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

  const isValidHttpUrl = (string: string | undefined) => {
    if (!string) return false;
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-white">Pedido de {order.locutor}</CardTitle>
            <CardDescription className="text-gray-400">{formattedDate}</CardDescription>
          </div>
          <Badge variant={order.status === 'pending' ? 'destructive' : 'default'} className="bg-opacity-80">
            {order.status === 'pending' ? 'Pendente' : 'Feito'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-300">Texto para Gravação:</h4>
          <p className="text-gray-400 bg-gray-900 p-3 rounded-md whitespace-pre-wrap text-sm">{order.texto || 'N/A'}</p>
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
          {order.musicaYoutube && (
             <div>
                <h4 className="font-semibold text-gray-300">Música de Referência</h4>
                <div className="flex items-center text-purple-400">
                    <Music className="mr-2 h-4 w-4" />
                     {isValidHttpUrl(order.musicaYoutube) ? (
                        <a href={order.musicaYoutube} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                            Ouvir no YouTube
                        </a>
                     ) : (
                        <span className="text-gray-400 truncate">{order.musicaYoutube}</span>
                     )}
                </div>
            </div>
          )}
        </div>
        {order.instrucoes && (
          <div>
            <h4 className="font-semibold text-gray-300">Instruções Adicionais:</h4>
            <p className="text-gray-400 text-sm">{order.instrucoes}</p>
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
    // Consulta a coleção global 'orders', filtrando pelo 'userId' do usuário logado.
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
  }, [user, firestore]);

  const { data: orders, isLoading, error } = useCollection<Order>(ordersQuery);

  if (isUserLoading || (!orders && isLoading)) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            <p className="mt-4">Carregando histórico de pedidos...</p>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-white p-10 bg-gray-900 min-h-screen flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p>Você precisa estar logado para ver seu histórico de pedidos.</p>
        <p className="text-sm text-gray-400">(O login é automático e anônimo ao visitar a página principal)</p>
        <Link href="/" className="text-purple-400 hover:underline mt-6 inline-block">
          Ir para a Página Principal
        </Link>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-10">Erro ao carregar o histórico: {error.message}</div>;
  }
  
  return (
    <div className="text-white min-h-screen bg-gray-900">
       <div className="container mx-auto p-4 md:p-8">
         <header className="text-center my-8 md:my-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Meus Pedidos
            </h1>
            <p className="text-lg text-gray-300 mt-2">
                Acompanhe todos os seus pedidos de locução.
            </p>
            <Link href="/" className="text-purple-400 hover:underline mt-4 inline-block">
                ← Fazer um novo pedido
            </Link>
         </header>

        <main className="space-y-6">
            {orders && orders.length > 0 ? (
                orders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
                <div className="text-center text-gray-400 p-10 bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold">Nenhum Pedido Encontrado</h3>
                    <p className="mt-2">Você ainda não fez nenhum pedido de locução.</p>
                    <Link href="/" passHref>
                        <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                            Criar meu primeiro pedido
                        </Button>
                    </Link>
                </div>
            )}
        </main>
       </div>
    </div>
  );
}

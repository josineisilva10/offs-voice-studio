'use client';

import React, { useState, useMemo } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { collectionGroup, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, Music, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

// O e-mail do administrador que terá acesso a esta página.
const ADMIN_EMAIL = 'josineisilva2@gmail.com';

interface Order {
  id: string; // O ID do documento do Firestore
  userId: string;
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

export default function AdminPage() {
  const router = useRouter();
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

  const allOrdersQuery = useMemo(() => {
    if (!firestore || !isAdmin) return null;
    return query(
      collectionGroup(firestore, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [firestore, isAdmin]);

  const { data: orders, isLoading, error } = useCollection<Order>(allOrdersQuery);

  const handleUpdateStatus = async (order: Order, newStatus: 'pending' | 'completed') => {
    if (!firestore || !isAdmin) return;

    setUpdatingStatus(order.id);
    try {
      const orderRef = doc(firestore, `users/${order.userId}/orders/${order.id}`);
      await updateDoc(orderRef, { status: newStatus });
    } catch (e) {
      console.error("Erro ao atualizar o status:", e);
      alert("Não foi possível atualizar o status. Verifique o console para mais detalhes.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  // Redireciona para o login se não estiver logado e o carregamento inicial já terminou
  if (!isUserLoading && !user) {
    router.push('/login');
    return null; // Renderiza nada enquanto redireciona
  }
  
  if (isUserLoading || (user && !orders && isLoading)) {
    return <div className="text-center text-white p-10">Carregando painel de administração...</div>;
  }

  // Mostra acesso negado se o usuário não for o administrador
  if (!isUserLoading && !isAdmin) {
    return (
      <div className="text-center text-red-500 p-10">
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        <p className="mt-2">Esta página é restrita ao administrador.</p>
        <Link href="/" className="text-purple-400 hover:underline mt-4 inline-block">
          Voltar para a página principal
        </Link>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-10">Erro ao carregar os pedidos: {error.message}</div>;
  }

  const isValidHttpUrl = (string: string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  return (
    <div className="text-white min-h-screen bg-gray-900">
       <div className="container mx-auto p-4 md:p-8">
         <header className="my-8 md:my-12">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    Painel do Administrador
                </h1>
                <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>
            <p className="text-lg text-gray-400 mt-2 text-center">
                Histórico completo de todos os pedidos recebidos.
            </p>
         </header>

        <main className="space-y-4">
            {orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente (ID)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Detalhes</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.orderDate).toLocaleString('pt-BR')}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 font-mono" title={order.userId}>{order.userId.substring(0, 10)}...</td>
                                    <td className="px-4 py-4 text-sm text-gray-300">
                                        <div className="font-bold">{order.locutor}</div>
                                        <div className="text-xs text-gray-400">{order.tipoGravacao} | {order.estiloGravacao}</div>
                                        <p className="mt-2 text-gray-400 text-xs bg-gray-900 p-2 rounded whitespace-pre-wrap max-w-md">{order.texto}</p>
                                        <div className="flex space-x-4 mt-2">
                                          {order.musicaYoutube && (
                                            <div className="text-purple-400 text-xs flex items-center">
                                                <Music className="mr-1 h-3 w-3" /> 
                                                {isValidHttpUrl(order.musicaYoutube) ? (
                                                    <a href={order.musicaYoutube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        Ouvir Música
                                                    </a>
                                                ) : (
                                                    <span>{order.musicaYoutube}</span>
                                                )}
                                            </div>
                                          )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-400">{order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>{order.status === 'pending' ? 'Pendente' : 'Feito'}</Badge>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(order, 'pending')} 
                                                disabled={updatingStatus === order.id || order.status === 'pending'}
                                            >
                                                {updatingStatus === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pendente'}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="secondary"
                                                onClick={() => handleUpdateStatus(order, 'completed')} 
                                                disabled={updatingStatus === order.id || order.status === 'completed'}
                                            >
                                               {updatingStatus === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Feito'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

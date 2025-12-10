'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Music, ShieldCheck, ShieldX } from 'lucide-react';
import Link from 'next/link';

// Defina o e-mail do administrador
const ADMIN_EMAIL = 'josineisilva2@gmail.com';

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
  userId: string;
}

// Componente principal da página Admin
export default function AdminPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  // Se estiver carregando o usuário, mostre uma tela de "verificando acesso"
  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        <p className="mt-4">Verificando acesso...</p>
      </div>
    );
  }

  // Se não houver usuário, redirecione para o login
  if (!user) {
    router.push('/login');
    return null;
  }
  
  // Se o usuário não for o admin, mostre "Acesso Negado"
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
        <ShieldX className="h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-bold mt-4">Acesso Negado</h1>
        <p className="text-gray-400 mt-2">Esta área é restrita aos administradores.</p>
        <Link href="/" className="mt-6 text-blue-400 hover:underline">
          Voltar para a Página Principal
        </Link>
      </div>
    );
  }

  // Se for o admin, renderize o painel
  return <AdminDashboard />;
}


// Componente que renderiza o painel de administração
function AdminDashboard() {
  const router = useRouter();
  const { firestore, auth } = useFirebase();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Consulta para buscar todos os documentos da coleção 'orders'
  const ordersQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading, error } = useCollection<Order>(ordersQuery);

  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'completed') => {
    if (!firestore) return;
    setUpdatingStatus(orderId);
    try {
      const orderRef = doc(firestore, 'orders', orderId);
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
  
  const isValidHttpUrl = (string: string) => {
    if (!string) return false;
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            <p className="mt-4">Carregando pedidos...</p>
        </div>
      );
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-10">Erro ao carregar os pedidos: {error.message}</div>;
  }

  return (
    <div className="text-white min-h-screen bg-gray-900">
       <div className="container mx-auto p-4 md:p-8">
         <header className="my-8 md:my-12">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-12 w-12 text-green-400" />
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                        Painel do Administrador
                    </h1>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>
            <p className="text-lg text-gray-400 mt-2">
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
                                        {order.musicaYoutube && (
                                            <div className="mt-2 text-purple-400 text-xs flex items-center gap-2">
                                                <Music className="h-3 w-3 flex-shrink-0" /> 
                                                {isValidHttpUrl(order.musicaYoutube) ? (
                                                    <a href={order.musicaYoutube} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                                        {order.musicaYoutube}
                                                    </a>
                                                ) : (
                                                    <span className="truncate">{order.musicaYoutube}</span>
                                                )}
                                            </div>
                                          )}
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
                                                onClick={() => handleUpdateStatus(order.id, 'pending')} 
                                                disabled={updatingStatus === order.id || order.status === 'pending'}
                                                className="disabled:opacity-30"
                                            >
                                                {updatingStatus === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pendente'}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="secondary"
                                                onClick={() => handleUpdateStatus(order.id, 'completed')} 
                                                disabled={updatingStatus === order.id || order.status === 'completed'}
                                                className="disabled:opacity-30"
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

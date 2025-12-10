'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';

const ADMIN_EMAIL = 'josineisilva2@gmail.com';

interface Order {
    id: string;
    title: string;
    narrationStyle: string;
    recordingStyle: string;
    recordingType: string;
    script: string;
    voiceActorId: string;
    userId: string;
    createdAt: Timestamp;
    status: 'pending' | 'in_progress' | 'done';
    usedCredits: number;
}

const AdminDashboard = () => {
    const { firestore } = useFirebase();

    const allOrdersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'all-orders'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: orders, isLoading, error } = useCollection<Order>(allOrdersQuery);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                <p className="ml-4">Carregando pedidos...</p>
            </div>
        );
    }
    
    if (error) {
        return <p className="text-red-500">Erro ao carregar pedidos: {error.message}</p>;
    }

    return (
        <div className="space-y-4">
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <Card key={order.id} className="bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{order.title}</CardTitle>
                            <CardDescription className="text-xs text-gray-400">
                                Pedido em: {order.createdAt.toDate().toLocaleString('pt-BR')} | Status: <span className="font-semibold text-yellow-400">{order.status}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                           <p><span className="font-semibold text-gray-300">Estilo Narração:</span> {order.narrationStyle}</p>
                           <p><span className="font-semibold text-gray-300">Estilo Gravação:</span> {order.recordingStyle}</p>
                           <p><span className="font-semibold text-gray-300">Tipo Gravação:</span> {order.recordingType}</p>
                           <p><span className="font-semibold text-gray-300">Locutor ID:</span> {order.voiceActorId}</p>
                           <p><span className="font-semibold text-gray-300">Créditos Usados:</span> {order.usedCredits}</p>
                           <p><span className="font-semibold text-gray-300">Usuário ID:</span> {order.userId}</p>
                           <p className="font-semibold text-gray-300">Roteiro:</p>
                           <pre className="text-xs bg-gray-900 p-2 rounded whitespace-pre-wrap font-sans">{order.script}</pre>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p>Nenhum pedido encontrado.</p>
            )}
        </div>
    );
};

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const { auth } = useFirebase();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    if (isUserLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                <p className="mt-4">Verificando acesso...</p>
            </div>
        );
    }
    
    if (!user || user.email !== ADMIN_EMAIL) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-2xl font-bold text-red-500">Acesso Negado</h1>
                <p className="mt-2">Você não tem permissão para acessar esta página.</p>
                <Button onClick={() => router.push('/admin/login')} className="mt-4">Ir para Login</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Painel do Administrador</h1>
                <Button onClick={handleLogout} variant="destructive">Sair</Button>
            </header>
            <main>
                <AdminDashboard />
            </main>
        </div>
    );
}

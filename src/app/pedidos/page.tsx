
'use client';

import { useMemo } from 'react';
import { collection, query, where, orderBy, CollectionReference } from 'firebase/firestore';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type RecordingOrder } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getStatusVariant(status: string) {
  switch (status) {
    case 'Concluído':
    case 'Entregue':
      return 'default';
    case 'Em produção':
      return 'secondary';
    case 'Aguardando entrega':
      return 'outline';
    default:
      return 'secondary';
  }
}

export default function PedidosPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemo(() => {
    if (user?.uid && firestore) {
      const ordersRef = collection(firestore, 'all-orders') as CollectionReference<RecordingOrder>;
      // Query for orders where the userId matches the current user's UID
      return query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }
    return undefined;
  }, [user?.uid, firestore]);

  const { data: orders, isLoading } = useCollection<RecordingOrder>(ordersQuery);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe o status de todas as suas gravações.
          </p>
        </div>

        {isLoading && <p>Carregando pedidos...</p>}

        {!isLoading && !orders?.length && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
          </div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg mb-0">{order.title}</CardTitle>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Pedido em{' '}
                    {order.createdAt
                      ? format(new Date(order.createdAt.seconds * 1000), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      : 'data indisponível'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Voz:</span> {order.voiceActorName || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Tipo:</span> {order.recordingType === 'off' ? 'Off (só a voz)' : 'Produzida'}
                  </p>
                   <p>
                    <span className="font-semibold">Créditos:</span> {order.usedCredits}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                  <Button size="sm" disabled={order.status !== 'Concluído'}>Baixar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

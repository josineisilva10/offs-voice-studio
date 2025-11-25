
'use client';

import { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useCollection, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  doc,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { type RecordingOrder } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

export default function AdminLocutoresPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const allOrdersQuery = useMemo(() => {
    if (firestore) {
      const ordersRef = collection(
        firestore,
        'all-orders'
      ) as CollectionReference<RecordingOrder>;
      return query(ordersRef, orderBy('createdAt', 'desc'));
    }
    return undefined;
  }, [firestore]);

  const { data: orders, isLoading } =
    useCollection<RecordingOrder>(allOrdersQuery);

  const [orderStatus, setOrderStatus] = useState<Record<string, string>>({});

  const handleStatusUpdate = async (orderId: string) => {
    const newStatus = orderStatus[orderId];
    if (!newStatus || !firestore) return;

    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
    try {
      const orderDocRef = doc(firestore, 'all-orders', orderId) as DocumentReference<RecordingOrder>;
      await updateDocumentNonBlocking(orderDocRef, { status: newStatus });
      toast({
        title: 'Sucesso!',
        description: `Status do pedido atualizado para "${newStatus}".`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o status do pedido.',
      });
    } finally {
        setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Pedidos e Locutores</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos de gravação da plataforma.
          </p>
        </div>

        {isLoading ? (
          <p>Carregando pedidos...</p>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="border rounded-lg w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Locutor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status Atual</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{order.userId}</TableCell>
                    <TableCell>{order.voiceActorName}</TableCell>
                    <TableCell>
                      {order.createdAt
                        ? format(
                            new Date(order.createdAt.seconds * 1000),
                            'dd/MM/yy HH:mm',
                            { locale: ptBR }
                          )
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                       <Button variant="outline" size="sm">
                          Ver Texto
                       </Button>
                       <Select
                         defaultValue={order.status}
                         onValueChange={(value) =>
                           setOrderStatus((prev) => ({ ...prev, [order.id]: value }))
                         }
                       >
                         <SelectTrigger className="w-[180px] h-9">
                           <SelectValue placeholder="Mudar status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Aguardando entrega">Aguardando</SelectItem>
                           <SelectItem value="Em produção">Em produção</SelectItem>
                           <SelectItem value="Concluído">Concluído</SelectItem>
                           <SelectItem value="Entregue">Entregue</SelectItem>
                         </SelectContent>
                       </Select>
                       <Button
                         size="sm"
                         onClick={() => handleStatusUpdate(order.id)}
                         disabled={updatingStatus[order.id] || !orderStatus[order.id]}
                       >
                         {updatingStatus[order.id] ? 'Salvando...' : 'Salvar'}
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

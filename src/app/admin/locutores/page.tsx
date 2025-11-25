
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
  increment,
  updateDoc,
  where,
  getDocs,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

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
  const [orderStatus, setOrderStatus] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<RecordingOrder | null>(null);

  // State for credit management
  const [targetUserIdentifier, setTargetUserIdentifier] = useState('');
  const [creditsToAdd, setCreditsToAdd] = useState(0);
  const [isAddingCredits, setIsAddingCredits] = useState(false);


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


  const handleStatusUpdate = async (orderId: string) => {
    const newStatus = orderStatus[orderId];
    if (!newStatus || !firestore) return;

    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));
    try {
      const orderDocRef = doc(firestore, 'all-orders', orderId) as DocumentReference<RecordingOrder>;
      await updateDoc(orderDocRef, { status: newStatus });
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

  const handleAddCredits = async () => {
    if (!targetUserIdentifier || creditsToAdd <= 0 || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Por favor, insira um ID de usuário ou e-mail válido e uma quantidade de créditos maior que zero.',
        });
        return;
    }
    setIsAddingCredits(true);

    let userId: string | null = null;
    let usedIdentifier = targetUserIdentifier;

    try {
        // Check if the identifier is an email
        if (targetUserIdentifier.includes('@')) {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('email', '==', targetUserIdentifier));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Found user by email
                const userDoc = querySnapshot.docs[0];
                userId = userDoc.id;
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'Nenhum usuário encontrado com este e-mail.',
                });
                setIsAddingCredits(false);
                return;
            }
        } else {
            // Assume it's a user ID
            userId = targetUserIdentifier;
        }

        if (userId) {
            const userDocRef = doc(firestore, 'users', userId);
            await updateDoc(userDocRef, {
                credits: increment(creditsToAdd)
            });
            toast({
                title: 'Sucesso!',
                description: `${creditsToAdd} créditos foram adicionados ao usuário ${usedIdentifier}.`,
            });
            setTargetUserIdentifier('');
            setCreditsToAdd(0);
        } else {
             throw new Error('ID do usuário não foi encontrado ou determinado.');
        }

    } catch (error) {
        console.error('Erro ao adicionar créditos:', error);
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível adicionar os créditos. Verifique o ID/e-mail do usuário e tente novamente.',
        });
    } finally {
        setIsAddingCredits(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie pedidos, locutores e créditos da plataforma.
          </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Gerenciamento de Créditos</CardTitle>
                <CardDescription>
                    Adicione créditos a uma conta de usuário específica usando o ID ou o e-mail do usuário.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-end gap-4">
                <div className="grid w-full sm:w-auto sm:flex-1 gap-2">
                    <Label htmlFor="userId">ID ou E-mail do Usuário</Label>
                    <Input 
                        id="userId" 
                        placeholder="Insira o ID ou E-mail do usuário"
                        value={targetUserIdentifier}
                        onChange={(e) => setTargetUserIdentifier(e.target.value)}
                    />
                </div>
                 <div className="grid w-full sm:w-[150px] gap-2">
                    <Label htmlFor="credits">Qtd. de Créditos</Label>
                    <Input 
                        id="credits" 
                        type="number" 
                        placeholder="0"
                        value={creditsToAdd}
                        onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                    />
                </div>
                <Button onClick={handleAddCredits} disabled={isAddingCredits} className="w-full sm:w-auto">
                    {isAddingCredits ? 'Adicionando...' : 'Adicionar Créditos'}
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <CardTitle>Gerenciamento de Pedidos</CardTitle>
                 <CardDescription>Visualize e gerencie todos os pedidos de gravação.</CardDescription>
            </CardHeader>
            <CardContent>
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
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
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
            </CardContent>
        </Card>
      </div>

       {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido: {selectedOrder.title}</DialogTitle>
              <DialogDescription>
                Revise o texto e as especificações do cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Roteiro para Gravação</h4>
                 <Textarea
                    readOnly
                    value={selectedOrder.script}
                    className="min-h-[250px] text-base bg-muted/50"
                  />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className='font-semibold text-muted-foreground'>Tipo:</span> {selectedOrder.recordingType === 'off' ? 'Off (só voz)' : 'Produzida'}</p>
                <p><span className='font-semibold text-muted-foreground'>Estilo:</span> {selectedOrder.recordingStyle}</p>
                <p><span className='font-semibold text-muted-foreground'>Locução:</span> {selectedOrder.narrationStyle}</p>
                <p><span className='font-semibold text-muted-foreground'>Locutor:</span> {selectedOrder.voiceActorName}</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Fechar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );


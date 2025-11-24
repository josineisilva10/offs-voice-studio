
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { ArrowUpRight, DollarSign, ListOrdered, Mic } from 'lucide-react';
import { orders } from '@/lib/data';
import Link from 'next/link';

export default function PainelPrincipal() {
  const recentOrders = orders.slice(0, 5);

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'Concluído':
        return 'default';
      case 'Processando':
        return 'secondary';
      case 'Falhou':
        return 'destructive';
      default:
        return 'default';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Painel Principal"
        description="Bem-vindo de volta! Aqui está um resumo da sua conta."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Créditos Disponíveis
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              créditos de voz
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos do Mês
            </CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              nenhum pedido este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Minutos Gerados
            </CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">00:00</div>
            <p className="text-xs text-muted-foreground">
              neste ciclo de faturamento
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Últimos Pedidos</CardTitle>
            <CardDescription>
              Aqui estão os últimos áudios que você gerou.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/pedidos">
              Ver Todos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead className="hidden sm:table-cell">Voz</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.id}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.text.substring(0, 30)}...
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{order.voice}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                  <TableCell className="text-right">
                     <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { MoreHorizontal, Download, Play } from 'lucide-react';
import { orders } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PedidosPage() {
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
        title="Meus Pedidos"
        description="Acompanhe o histórico de todas as suas gravações e downloads."
      />
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos</CardTitle>
          <CardDescription>
            Você tem {orders.length} pedidos no total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead className="hidden lg:table-cell">Texto</TableHead>
                <TableHead className="hidden md:table-cell">Voz</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {order.text.substring(0, 40)}...
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.voice}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem disabled={order.status !== 'Concluído'}>
                          <Play className="mr-2 h-4 w-4" />
                          Ouvir
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={order.status !== 'Concluído'}>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

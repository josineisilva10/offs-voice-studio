
'use client';

import { useFirestore } from '@/firebase';
import type { VoiceActor } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';


type LocutoresAdminListProps = {
  voiceActors: VoiceActor[];
  isLoading: boolean;
};

export function LocutoresAdminList({ voiceActors, isLoading }: LocutoresAdminListProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleFieldChange = (actorId: string, field: keyof VoiceActor, value: any) => {
    if (!firestore) return;

    // We can only edit actors that are in the database.
    // Static actors are not editable through this interface.
    if (actorId.includes('-static')) {
        toast({
            title: 'Locutor Estático',
            description: 'Locutores da lista estática não podem ser editados aqui.',
            variant: 'destructive',
        });
        return;
    }

    const actorDocRef = doc(firestore, 'voice_actors', actorId);
    
    setDocumentNonBlocking(actorDocRef, { [field]: value }, { merge: true });

    toast({
        title: 'Locutor Atualizado',
        description: `O campo ${String(field)} foi atualizado.`,
    });
  };

  const renderSkeleton = () => (
     <Card>
        <CardHeader>
          <CardTitle>Carregando Locutores...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="w-1/4">
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="w-1/4">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-1/4">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-24">
                    <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Locutores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Locutor</TableHead>
              <TableHead className="w-[200px]">Tempo de Entrega (min)</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voiceActors?.map((actor) => (
              <TableRow key={actor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={actor.imageUrl} alt={actor.name} />
                      <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{actor.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={actor.deliveryTimeMinutes}
                    onBlur={(e) => handleFieldChange(actor.id, 'deliveryTimeMinutes', Number(e.target.value))}
                    placeholder="Ex: 60"
                    disabled={actor.id.includes('-static')}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={actor.status}
                    onValueChange={(value) => handleFieldChange(actor.id, 'status', value)}
                     disabled={actor.id.includes('-static')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Definir status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" disabled>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

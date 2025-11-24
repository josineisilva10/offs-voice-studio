
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
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
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function LocutoresAdminList() {
  const firestore = useFirestore();
  const voiceActorsRef = useMemoFirebase(() => collection(firestore, 'voice_actors'), [firestore]);
  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsRef);
  const { toast } = useToast();

  const handleFieldChange = async (actorId: string, field: keyof VoiceActor, value: any) => {
    if (!firestore) return;

    const actorDocRef = doc(firestore, 'voice_actors', actorId);
    try {
      await setDoc(actorDocRef, { [field]: value }, { merge: true });
      toast({
        title: 'Locutor Atualizado',
        description: `O campo ${String(field)} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Failed to update voice actor:', error);
      toast({
        title: 'Erro ao Atualizar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando Locutores...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
                  />
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={actor.status}
                    onValueChange={(value) => handleFieldChange(actor.id, 'status', value)}
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

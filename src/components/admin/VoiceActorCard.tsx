// src/components/admin/VoiceActorCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { VoiceActor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface VoiceActorCardProps {
  actor: VoiceActor;
}

export function VoiceActorCard({ actor }: VoiceActorCardProps) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const [isOnline, setIsOnline] = useState(actor.isOnline);
  const [deliveryTime, setDeliveryTime] = useState(actor.estimatedDeliveryTime);

  const handleStatusChange = async (checked: boolean) => {
    if (!firestore) return;
    setIsOnline(checked);
    const actorRef = doc(firestore, 'voice_actors', actor.id);
    try {
      await updateDoc(actorRef, { isOnline: checked });
      toast({
        title: 'Status atualizado!',
        description: `${actor.name} está agora ${checked ? 'Online' : 'Offline'}.`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      setIsOnline(!checked); // Revert on error
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Não foi possível alterar o status do locutor.',
      });
    }
  };

  const handleTimeChange = async () => {
     if (!firestore) return;
     const actorRef = doc(firestore, 'voice_actors', actor.id);
     try {
      await updateDoc(actorRef, { estimatedDeliveryTime: deliveryTime });
       toast({
        title: 'Tempo de entrega atualizado!',
        description: `O tempo de entrega de ${actor.name} foi salvo.`,
      });
     } catch (error) {
       console.error('Failed to update delivery time:', error);
       toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar o tempo de entrega.',
      });
     }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Image
            src={actor.avatarUrl}
            alt={actor.name}
            width={64}
            height={64}
            className="rounded-full"
          />
          <CardTitle className="text-xl">{actor.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`status-${actor.id}`} className="font-medium">
            Status
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id={`status-${actor.id}`}
              checked={isOnline}
              onCheckedChange={handleStatusChange}
            />
            <span className={isOnline ? 'text-green-500' : 'text-gray-500'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`delivery-${actor.id}`} className="font-medium">
            Tempo Estimado de Entrega
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`delivery-${actor.id}`}
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="Ex: 30 minutos"
            />
            <Button onClick={handleTimeChange}>Salvar</Button>
          </div>
        </div>

        <div className="border-t pt-4">
           <Button variant="outline">Ver Solicitações</Button>
        </div>
      </CardContent>
    </Card>
  );
}

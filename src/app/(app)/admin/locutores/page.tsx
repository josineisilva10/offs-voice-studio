// src/app/(app)/admin/locutores/page.tsx
'use client';

import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { VoiceActor } from '@/lib/types';
import { VoiceActorCard } from '@/components/admin/VoiceActorCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const newActorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  avatarUrl: z.string().url('URL do avatar inválida'),
  styleTags: z.string().min(1, 'Pelo menos uma tag de estilo é necessária'),
  biography: z.string().min(1, 'Biografia é obrigatória'),
  estimatedDeliveryTime: z.string().min(1, 'Tempo de entrega é obrigatório'),
});

type NewActorFormValues = z.infer<typeof newActorSchema>;

export default function AdminLocutoresPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewActorFormValues>({
    resolver: zodResolver(newActorSchema),
  });

  const voiceActorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voice_actors'), orderBy('name'));
  }, [firestore]);

  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsQuery);

  const handleAddActor = async (data: NewActorFormValues) => {
    if (!firestore) return;

    try {
      await addDoc(collection(firestore, 'voice_actors'), {
        name: data.name,
        avatarUrl: data.avatarUrl,
        styleTags: data.styleTags.split(',').map(tag => tag.trim()),
        biography: data.biography,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        isOnline: false, // Default to offline
      });

      toast({
        title: 'Locutor adicionado!',
        description: `${data.name} foi adicionado com sucesso.`,
      });
      reset(); // Reset form
      // The DialogClose button will close the dialog
    } catch (error) {
      console.error('Error adding voice actor:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar locutor',
        description: 'Ocorreu um problema ao salvar os dados.',
      });
    }
  };

  if (isLoading) {
    return <p>Carregando locutores...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Locutores</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar Novo Locutor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Locutor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddActor)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL do Avatar</Label>
                <Input id="avatarUrl" {...register('avatarUrl')} />
                {errors.avatarUrl && <p className="text-red-500 text-sm">{errors.avatarUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="styleTags">Tags de Estilo (separadas por vírgula)</Label>
                <Input id="styleTags" {...register('styleTags')} placeholder="Jovem, Impacto, Padrão" />
                {errors.styleTags && <p className="text-red-500 text-sm">{errors.styleTags.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="biography">Biografia</Label>
                <Textarea id="biography" {...register('biography')} />
                {errors.biography && <p className="text-red-500 text-sm">{errors.biography.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDeliveryTime">Tempo de Entrega</Label>
                <Input id="estimatedDeliveryTime" {...register('estimatedDeliveryTime')} placeholder="Ex: 30 minutos" />
                {errors.estimatedDeliveryTime && <p className="text-red-500 text-sm">{errors.estimatedDeliveryTime.message}</p>}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Locutor'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {voiceActors && voiceActors.length > 0 ? (
          voiceActors.map((actor) => (
            <VoiceActorCard key={actor.id} actor={actor} />
          ))
        ) : (
          <p>Nenhum locutor encontrado.</p>
        )}
      </div>
    </div>
  );
}

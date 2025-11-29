'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirebase, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  where,
  addDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { VoiceActor, UserProfile } from '@/lib/types';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const recordingSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  type: z.enum(['Off', 'Produzida']),
  style: z.enum(['Abertura', 'Comercial', 'Chamada para festa', 'Vinhetas']),
  voiceActorId: z.string().min(1, 'Selecione uma voz'),
  locutionStyle: z.enum(['Padrão', 'Impacto', 'Varejo', 'Jovem', 'Outros']),
  otherLocutionStyle: z.string().optional(),
  script: z.string().min(1, 'O texto da locução é obrigatório'),
});

type RecordingFormValues = z.infer<typeof recordingSchema>;

export default function GravacaoPage() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [estimatedSeconds, setEstimatedSeconds] = useState(0);
  const [neededCredits, setNeededCredits] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordingFormValues>({
    resolver: zodResolver(recordingSchema),
    defaultValues: {
      type: 'Off',
      style: 'Comercial',
      locutionStyle: 'Padrão',
    },
  });

  const scriptValue = watch('script');
  const selectedVoiceActorId = watch('voiceActorId');

  const voiceActorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voice_actors'), where('isOnline', '==', true));
  }, [firestore]);

  const { data: voiceActors, isLoading: isLoadingActors } =
    useCollection<VoiceActor>(voiceActorsQuery);
    
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const hasEnoughCredits = userProfile ? userProfile.creditBalance >= neededCredits : false;

  useEffect(() => {
    const words = scriptValue?.split(/\s+/).filter(Boolean).length || 0;
    const seconds = Math.round(words / 3); // Average 3 words per second
    setEstimatedSeconds(seconds);
    const credits = Math.ceil(seconds / 40);
    setNeededCredits(credits);
  }, [scriptValue]);

  const onSubmit = async (data: RecordingFormValues) => {
    if (!firestore || !user) return;
    if (!hasEnoughCredits) {
       toast({
        variant: "destructive",
        title: "Créditos insuficientes",
        description: "Você não tem créditos suficientes para este pedido.",
      });
      return;
    }

    const selectedActor = voiceActors?.find(va => va.id === data.voiceActorId);

    const orderData = {
      ...data,
      userId: user.uid,
      orderDate: new Date().toISOString(),
      status: 'Aguardando entrega',
      creditsUsed: neededCredits,
      estimatedDurationSeconds: estimatedSeconds,
      voiceActorName: selectedActor?.name || 'N/A',
    };

    try {
      const batch = writeBatch(firestore);
      
      // 1. Add to user's orders subcollection
      const userOrderRef = doc(collection(firestore, 'users', user.uid, 'orders'));
      batch.set(userOrderRef, orderData);

      // 2. Add to top-level all-orders collection
      const allOrdersRef = doc(collection(firestore, 'all-orders'), userOrderRef.id);
      batch.set(allOrdersRef, orderData);
      
      // 3. Update user's credit balance
      const userRef = doc(firestore, 'users', user.uid);
      const newBalance = (userProfile?.creditBalance ?? 0) - neededCredits;
      batch.update(userRef, { creditBalance: newBalance });
      
      await batch.commit();

      toast({
        title: 'Pedido enviado!',
        description: 'Sua gravação foi enviada para produção.',
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar pedido',
        description:
          'Ocorreu um problema ao processar seu pedido. Tente novamente.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Gravação de Voz</h1>

      <div className="flex justify-between items-center mb-8 p-4 bg-secondary rounded-lg">
        <div>
          <p className="text-muted-foreground">Seu saldo</p>
          <p className="text-2xl font-bold">{userProfile?.creditBalance ?? 0} créditos</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Este pedido custará</p>
           <p className={`text-2xl font-bold ${!hasEnoughCredits ? 'text-red-500' : ''}`}>
            {neededCredits} créditos
          </p>
          <p className="text-sm text-muted-foreground">({estimatedSeconds} segundos)</p>
        </div>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg">
            Nome/Título da Gravação
          </Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label className="text-lg">Tipo de Gravação</Label>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <Label className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="Off" id="off" />
                  <span>Off</span>
                </Label>
                <Label className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="Produzida" id="produzida" />
                  <span>Produzida</span>
                </Label>
              </RadioGroup>
            </div>
          )}
        />

        <Controller
          name="style"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="style" className="text-lg">
                Estilo de Gravação
              </Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Abertura">Abertura</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Chamada para festa">
                    Chamada para festa
                  </SelectItem>
                  <SelectItem value="Vinhetas">Vinhetas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <div className="space-y-4">
          <Label className="text-lg">Selecionar Voz</Label>
          {isLoadingActors ? (
            <p>Carregando vozes...</p>
          ) : (
            <Controller
              name="voiceActorId"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {voiceActors?.map((actor) => (
                    <Card
                      key={actor.id}
                      onClick={() => field.onChange(actor.id)}
                      className={`cursor-pointer transition-all ${
                        field.value === actor.id
                          ? 'ring-2 ring-primary'
                          : 'ring-0'
                      }`}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Image
                          src={actor.avatarUrl}
                          alt={actor.name}
                          width={80}
                          height={80}
                          className="rounded-full mb-2"
                        />
                        <h3 className="font-semibold">{actor.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {actor.styleTags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Play audio logic here
                          }}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            />
          )}
          {errors.voiceActorId && (
            <p className="text-red-500 text-sm">
              {errors.voiceActorId.message}
            </p>
          )}
        </div>

        <Controller
          name="locutionStyle"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label className="text-lg">Estilo de Locução</Label>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-4"
              >
                {[ 'Padrão', 'Impacto', 'Varejo', 'Jovem', 'Outros'].map(style => (
                   <Label key={style} className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value={style} />
                    <span>{style}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}
        />
        
        {watch('locutionStyle') === 'Outros' && (
           <div className="space-y-2">
            <Label htmlFor="otherLocutionStyle">Especifique o estilo</Label>
            <Input id="otherLocutionStyle" {...register('otherLocutionStyle')} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="script" className="text-lg">
            Texto para Locução
          </Label>
          <Textarea id="script" {...register('script')} rows={8} />
          {errors.script && (
            <p className="text-red-500 text-sm">{errors.script.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !hasEnoughCredits}>
          {isSubmitting ? 'Enviando...' : `Gerar Gravação (${neededCredits} créditos)`}
        </Button>
         {!hasEnoughCredits && <p className="text-red-500 text-center mt-2">Saldo insuficiente - compre créditos para gerar esta gravação.</p>}
      </form>
    </div>
  );
}

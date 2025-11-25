
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MainLayout } from '@/components/layout/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Play, Upload, Mic as MicIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { staticVoiceActors, type VoiceActor } from '@/lib/data';
import { doc, DocumentReference, serverTimestamp, increment, collection } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { type RecordingOrder } from '@/lib/types';


const formSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  recordingType: z.enum(['off', 'produzida'], {
    required_error: 'Selecione o tipo de gravação.',
  }),
  recordingStyle: z.string({ required_error: 'Selecione o estilo.' }),
  voiceActorId: z.string({ required_error: 'Selecione uma voz.' }),
  narrationStyle: z.string({ required_error: 'Selecione o estilo de locução.' }),
  otherNarrationStyle: z.string().optional(),
  script: z.string().min(1, { message: 'O texto para locução é obrigatório.' }),
  referenceAudio: z.any().optional(),
});

// Estimativa de palavras por segundo (ajuste conforme necessário)
const WORDS_PER_SECOND = 2.5;

interface UserProfile {
  credits: number;
}

export default function GravacaoPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [estimatedSeconds, setEstimatedSeconds] = useState(0);
  const [requiredCredits, setRequiredCredits] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDocRef = useMemo(() => {
    if (user?.uid && firestore) {
      return doc(firestore, 'users', user.uid) as DocumentReference<UserProfile>;
    }
    return undefined;
  }, [user?.uid, firestore]);

  const { data: userProfile, isLoading: isUserLoading } = useDoc<UserProfile>(userDocRef);
  
  const userCredits = useMemo(() => userProfile?.credits ?? 0, [userProfile]);
  const hasSufficientCredits = useMemo(() => userCredits >= requiredCredits, [userCredits, requiredCredits]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      otherNarrationStyle: '',
      script: '',
    },
  });

  const selectedVoiceActorId = form.watch('voiceActorId');
  const scriptText = form.watch('script');

  useEffect(() => {
    if (scriptText) {
      const wordCount = scriptText.trim().split(/\s+/).filter(Boolean).length;
      const seconds = Math.max(1, Math.ceil(wordCount / WORDS_PER_SECOND));
      setEstimatedSeconds(seconds);
      
      const credits = Math.ceil(seconds / 40);
      setRequiredCredits(credits);
    } else {
      setEstimatedSeconds(0);
      setRequiredCredits(0);
    }
  }, [scriptText]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userDocRef || !firestore) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado para fazer um pedido.' });
      return;
    }
    
    if (!hasSufficientCredits) {
       toast({ variant: 'destructive', title: 'Créditos insuficientes', description: 'Você não tem créditos suficientes para esta gravação.' });
       return;
    }

    setIsSubmitting(true);

    try {
      const selectedVoiceActor = voiceActors.find(actor => actor.id === values.voiceActorId);

      const orderData: Omit<RecordingOrder, 'id'> = {
        userId: user.uid,
        title: values.title,
        recordingType: values.recordingType,
        recordingStyle: values.recordingStyle,
        voiceActorId: values.voiceActorId,
        voiceActorName: selectedVoiceActor?.name || 'N/A',
        narrationStyle: values.narrationStyle === 'outros' ? values.otherNarrationStyle || 'Outros' : values.narrationStyle,
        script: values.script,
        usedCredits: requiredCredits,
        status: 'Aguardando entrega',
        createdAt: serverTimestamp(),
      };

      const ordersCollection = collection(firestore, 'all-orders');
      await addDocumentNonBlocking(ordersCollection, orderData);

      await updateDocumentNonBlocking(userDocRef, {
        credits: increment(-requiredCredits)
      });
      
      toast({
        title: 'Pedido criado com sucesso!',
        description: `Sua gravação "${values.title}" foi enviada para produção.`,
      });

      router.push('/pedidos');

    } catch (error) {
      console.error("Erro ao criar o pedido:", error);
      toast({
        variant: 'destructive',
        title: 'Ops! Algo deu errado.',
        description: 'Não foi possível criar seu pedido. Tente novamente.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const narrationStyle = form.watch('narrationStyle');

  // Por enquanto, usaremos apenas os dados estáticos.
  const voiceActors = staticVoiceActors;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Gravação de Voz</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para solicitar sua locução.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Detalhes da Gravação</CardTitle>
                <CardDescription>
                  Comece com as informações básicas do seu projeto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Título da gravação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Vinheta para minha loja" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="recordingType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de gravação</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="off" />
                              </FormControl>
                              <FormLabel className="font-normal">Off (só a voz)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="produzida" />
                              </FormControl>
                              <FormLabel className="font-normal">Produzida (com trilha e efeitos)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recordingStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo de gravação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="abertura">Abertura</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="chamada-festa">Chamada para festa</SelectItem>
                            <SelectItem value="vinheta">Vinheta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Selecionar Voz</CardTitle>
                <CardDescription>
                  Escolha o locutor ou a voz de IA ideal para seu projeto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="voiceActorId"
                  render={({ field }) => (
                    <FormItem>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        {voiceActors.map((actor) => (
                          <FormItem key={actor.id} className="w-full">
                            <FormControl>
                              <RadioGroupItem value={actor.id} className="sr-only" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                                selectedVoiceActorId === actor.id && "border-primary"
                              )}
                            >
                              <Avatar className="w-20 h-20 mb-4">
                                <AvatarImage src={actor.avatarUrl} alt={actor.name} />
                                <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-center mb-2">{actor.name}</span>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {actor.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                                onClick={(e) => { e.preventDefault(); alert(`Tocando demo de ${actor.name}`); }}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Ouvir Demo
                              </Button>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                      <FormMessage className="pt-2" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle>3. Estilo de Locução e Roteiro</CardTitle>
                 <CardDescription>
                    Defina o tom da locução e insira o texto a ser gravado.
                 </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="narrationStyle"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Estilo de locução</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="padrao" /></FormControl>
                            <FormLabel className="font-normal">Padrão</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="impacto" /></FormControl>
                            <FormLabel className="font-normal">Impacto</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="varejo" /></FormControl>
                            <FormLabel className="font-normal">Varejo</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="jovem" /></FormControl>
                            <FormLabel className="font-normal">Jovem</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="outros" /></FormControl>
                            <FormLabel className="font-normal">Outros</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {narrationStyle === 'outros' && (
                  <FormField
                    control={form.control}
                    name="otherNarrationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especifique o estilo de locução</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Estilo Sussurrado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto para locução</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cole ou escreva seu roteiro aqui..."
                          className="resize-y min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className='flex justify-between pt-2'>
                        <span>Caracteres: {scriptText?.length || 0}</span>
                        <span>
                          Tempo estimado: {estimatedSeconds}s  | Créditos necessários: {requiredCredits}
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle>4. Enviar Referência (Opcional)</CardTitle>
                <CardDescription>
                  Se precisar, envie um áudio ou mais detalhes para guiar o locutor.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button type="button" variant="outline" className='h-auto py-4'>
                    <MicIcon className="mr-2 h-5 w-5" />
                     Gravar áudio agora
                  </Button>
                 <FormField
                  control={form.control}
                  name="referenceAudio"
                  render={({ field }) => (
                    <FormItem>
                       <Button asChild type="button" variant="outline" className='h-auto py-4 w-full'>
                          <FormLabel className='w-full cursor-pointer flex items-center justify-center'>
                            <Upload className="mr-2 h-5 w-5" />
                            Enviar arquivo de áudio
                          </FormLabel>
                       </Button>
                      <FormControl>
                        <Input type="file" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end items-center gap-4 p-4 bg-muted/40 rounded-lg">
                <div className='text-right'>
                    <p className='font-bold text-lg'>Total: {requiredCredits} crédito(s)</p>
                    <p className='text-sm text-muted-foreground'>Seu saldo: {isUserLoading ? '...' : userCredits} créditos</p>
                     {!isUserLoading && !hasSufficientCredits && requiredCredits > 0 && (
                        <p className='text-sm text-destructive font-semibold'>
                            Saldo insuficiente.
                        </p>
                    )}
                </div>
              <Button type="submit" size="lg" disabled={!hasSufficientCredits || requiredCredits === 0 || isUserLoading || isSubmitting}>
                {isSubmitting ? 'Enviando Pedido...' : isUserLoading ? 'Carregando...' : 'Gerar Gravação'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}

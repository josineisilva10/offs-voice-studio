'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateVoiceFromText } from '@/ai/flows/generate-voice-from-text';
import type { Voice, RecordingStyle, LocutionStyle } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mic, Play, Download, Upload, Waves, AudioLines, Square, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const WORDS_PER_MINUTE = 140;
const SECONDS_PER_CREDIT = 40;

const formSchema = z.object({
  recordingName: z.string().min(1, { message: 'Por favor, dê um nome para a sua gravação.' }),
  productionType: z.enum(['off', 'produzida'], { required_error: 'Selecione o tipo de produção.' }),
  recordingStyle: z.string({ required_error: 'Selecione um estilo de gravação.' }),
  locutionStyle: z.string({ required_error: 'Selecione um estilo de locução.' }),
  voiceName: z.string({ required_error: 'Por favor, selecione uma voz.' }),
  mainText: z.string().optional(),
  vignetteText1: z.string().optional(),
  vignetteText2: z.string().optional(),
  vignetteText3: z.string().optional(),
  vignetteText4: z.string().optional(),
  referenceType: z.enum(['audio', 'record', 'text']).optional(),
  referenceAudio: z.any().optional(),
  referenceText: z.string().optional(),
});

type VoiceGenerationFormProps = {
  availableVoices: Voice[];
  recordingStyles: RecordingStyle[];
  locutionStyles: LocutionStyle[];
};

export function VoiceGenerationForm({ availableVoices, recordingStyles, locutionStyles }: VoiceGenerationFormProps) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [credits, setCredits] = useState(0);
  const [sampleAudio, setSampleAudio] = useState<HTMLAudioElement | null>(null);
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const [isSamplePlaying, setIsSamplePlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordingName: '',
      productionType: 'off',
      mainText: '',
      vignetteText1: '',
      vignetteText2: '',
      vignetteText3: '',
      vignetteText4: '',
      referenceType: 'audio',
      referenceText: '',
    },
  });

  const watchedRecordingStyle = useWatch({ control: form.control, name: 'recordingStyle' });
  const watchedTexts = useWatch({ control: form.control, name: ['mainText', 'vignetteText1', 'vignetteText2', 'vignetteText3', 'vignetteText4'] });
  const watchedVoice = useWatch({ control: form.control, name: 'voiceName' });

  useEffect(() => {
    const isVignette = watchedRecordingStyle === 'vinhetas';
    let textForCalculation = '';

    if (isVignette) {
      const [ , vt1, vt2, vt3, vt4] = watchedTexts;
      textForCalculation = [vt1, vt2, vt3, vt4].filter(Boolean).join(' ');
    } else {
      textForCalculation = watchedTexts[0] || '';
    }
    
    const totalWords = textForCalculation.trim().split(/\s+/).filter(Boolean).length;
    const timeInSeconds = Math.ceil((totalWords / WORDS_PER_MINUTE) * 60);
    setEstimatedTime(timeInSeconds);

    if (timeInSeconds === 0) {
      setCredits(0);
    } else {
      const calculatedCredits = Math.floor((timeInSeconds - 1) / SECONDS_PER_CREDIT) + 1;
      setCredits(calculatedCredits);
    }

  }, [watchedTexts, watchedRecordingStyle]);
  
  useEffect(() => {
    // Stop any playing sample when the voice selection changes
    if (sampleAudio) {
      sampleAudio.pause();
      setIsSamplePlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedVoice]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAudioDataUri(null);
    
    const isVignette = values.recordingStyle === 'vinhetas';
    let textToGenerate = '';
    if(isVignette) {
      textToGenerate = [values.vignetteText1, values.vignetteText2, values.vignetteText3, values.vignetteText4].filter(Boolean).join('. ');
    } else {
      textToGenerate = values.mainText || '';
    }

    if (!textToGenerate) {
        toast({
            title: 'Texto ausente',
            description: 'Por favor, insira o texto para gerar o áudio.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }


    try {
      const result = await generateVoiceFromText({ text: textToGenerate, voiceName: values.voiceName });
      setAudioDataUri(result.audioDataUri);
      toast({
        title: 'Áudio Gerado com Sucesso!',
        description: 'Seu áudio está pronto para ser reproduzido.',
      });
    } catch (error) {
      console.error('Voice generation failed:', error);
      toast({
        title: 'Erro na Geração',
        description: 'Não foi possível gerar o áudio. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePlaySample = async () => {
    const voiceId = form.getValues('voiceName');
    if (!voiceId) {
      toast({ title: 'Selecione uma voz', description: 'Você precisa selecionar uma voz para ouvir a demonstração.', variant: 'destructive'});
      return;
    }

    if (isSamplePlaying && sampleAudio) {
      sampleAudio.pause();
      setIsSamplePlaying(false);
      return;
    }
    
    if (sampleAudio) {
      sampleAudio.pause();
    }
    
    setIsSampleLoading(true);
    setIsSamplePlaying(false);

    try {
      const voice = availableVoices.find(v => v.id === voiceId);
      if (!voice) return;
      
      const result = await generateVoiceFromText({ text: voice.sampleText, voiceName: voice.id });
      const newAudio = new Audio(result.audioDataUri);
      newAudio.play();
      newAudio.onended = () => {
        setIsSamplePlaying(false);
      };
      setSampleAudio(newAudio);
      setIsSamplePlaying(true);
    } catch (error) {
      console.error('Failed to play sample:', error);
      toast({ title: 'Erro', description: 'Não foi possível reproduzir a amostra.', variant: 'destructive' });
    } finally {
      setIsSampleLoading(false);
    }
  };

  const isVignetteMode = watchedRecordingStyle === 'vinhetas';

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Gerar Nova Gravação</CardTitle>
            <CardDescription>Preencha os detalhes abaixo para criar sua locução personalizada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <FormField
              control={form.control}
              name="recordingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Gravação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Campanha de Verão - Rádio Feliz FM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="productionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Produção</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="off" />
                          </FormControl>
                          <FormLabel className="font-normal">Off (Somente Voz)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="produzida" />
                          </FormControl>
                          <FormLabel className="font-normal">Produzida</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="voiceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voz</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma voz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name} ({voice.gender})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       <Button 
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handlePlaySample}
                          disabled={isSampleLoading || !watchedVoice}
                          aria-label="Ouvir demonstração"
                       >
                          {isSampleLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isSamplePlaying ? (
                            <Square className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                       </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recordingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo de Gravação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recordingStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="locutionStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo de Locução</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locutionStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {isVignetteMode ? (
              <div className="space-y-4">
                <FormLabel>Textos para Vinhetas</FormLabel>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vignetteText1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Vinheta 1" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vignetteText2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Vinheta 2" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vignetteText3"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Vinheta 3" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vignetteText4"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Vinheta 4" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                 </div>
              </div>
            ) : (
               <FormField
                control={form.control}
                name="mainText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto para gravação</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite seu texto aqui..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
           

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
                  <div className="text-sm text-muted-foreground mb-1">Tempo Estimado</div>
                  <div className="text-2xl font-bold font-headline">{estimatedTime}s</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
                  <div className="text-sm text-muted-foreground mb-1">Créditos a Serem Usados</div>
                  <div className="text-2xl font-bold font-headline">{credits}</div>
              </div>
               <div className="p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
                  <div className="flex items-center text-sm text-muted-foreground mb-1"><Wallet className="mr-2 h-4 w-4" /> Saldo Atual</div>
                  <div className="text-2xl font-bold font-headline">1.250</div>
              </div>
            </div>

            <div>
              <FormLabel>Enviar Referência (Opcional)</FormLabel>
              <FormField
                control={form.control}
                name="referenceType"
                render={({ field }) => (
                  <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="audio"><Upload className="mr-2" />Áudio</TabsTrigger>
                      <TabsTrigger value="record"><AudioLines className="mr-2" />Gravar</TabsTrigger>
                      <TabsTrigger value="text"><Waves className="mr-2" />Escrito</TabsTrigger>
                    </TabsList>
                    <TabsContent value="audio" className="mt-4">
                      <FormField
                        control={form.control}
                        name="referenceAudio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload de arquivo de áudio</FormLabel>
                            <FormControl>
                              <Input type="file" accept="audio/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="record" className="mt-4">
                       <Card className="text-center p-6">
                        <CardDescription>
                          Funcionalidade de gravação de voz em desenvolvimento.
                        </CardDescription>
                      </Card>
                    </TabsContent>
                    <TabsContent value="text" className="mt-4">
                      <FormField
                        control={form.control}
                        name="referenceText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descreva sua referência</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Ex: Quero uma locução com um tom animado e rápido, parecido com locutores de rádio jovens." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                        />
                    </TabsContent>
                  </Tabs>
                )}
              />
            </div>


            {(isLoading || audioDataUri) && (
              <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[80px]">
                {isLoading && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span>Gerando áudio...</span>
                  </div>
                )}
                {audioDataUri && (
                  <div className="w-full space-y-4">
                    <audio ref={audioRef} src={audioDataUri} className="w-full" controls/>
                    <div className="flex gap-2">
                        <a href={audioDataUri} download={`${form.getValues('recordingName') || 'vozgenius'}-${Date.now()}.wav`}>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Áudio
                            </Button>
                        </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || credits === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Gerar Áudio ({credits} {credits === 1 ? 'crédito' : 'créditos'})
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateVoiceFromText } from '@/ai/flows/generate-voice-from-text';
import type { Voice } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mic, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  text: z.string().min(5, { message: 'O texto deve ter pelo menos 5 caracteres.' }),
  voiceName: z.string({ required_error: 'Por favor, selecione uma voz.' }),
});

type VoiceGenerationFormProps = {
  availableVoices: Voice[];
};

export function VoiceGenerationForm({ availableVoices }: VoiceGenerationFormProps) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAudioDataUri(null);
    try {
      const result = await generateVoiceFromText(values);
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

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Gerar Nova Gravação</CardTitle>
            <CardDescription>Insira o texto que deseja converter em áudio e selecione a voz desejada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="text"
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
            <FormField
              control={form.control}
              name="voiceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voz</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        <a href={audioDataUri} download={`vozgenius-${Date.now()}.wav`}>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Gerar Áudio
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

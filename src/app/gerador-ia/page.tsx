'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { MainLayout } from '@/components/layout/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateScript } from '@/ai/flows/generate-script-flow';

const formSchema = z.object({
  prompt: z
    .string()
    .min(10, { message: 'Descreva seu produto ou serviço com mais detalhes.' }),
});

// Estimativa de palavras por segundo (a mesma da página de gravação)
const WORDS_PER_SECOND = 2.5;

export default function GeradorIaPage() {
  const [generatedScript, setGeneratedScript] = useState('');
  const [estimatedSeconds, setEstimatedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setGeneratedScript('');
    setEstimatedSeconds(0);

    try {
      const result = await generateScript({ prompt: values.prompt });
      setGeneratedScript(result.script);

      // Calcular duração estimada
      const wordCount = result.script.trim().split(/\s+/).filter(Boolean).length;
      const seconds = Math.max(1, Math.ceil(wordCount / WORDS_PER_SECOND));
      setEstimatedSeconds(seconds);

    } catch (err) {
      console.error(err);
      setError('Não foi possível gerar o texto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Gerador de Texto com IA</h1>
          <p className="text-muted-foreground">
            Descreva seu produto, serviço ou ideia e deixe a IA criar um roteiro
            para você.
          </p>
        </div>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Suas Informações</CardTitle>
                <CardDescription>
                  Quanto mais detalhes você fornecer, melhor será o texto
                  gerado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        O que você quer anunciar? (Ex: produto, público, tom da
                        locução)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Estou vendendo um tênis de corrida para atletas amadores. Quero um texto com tom energético e motivacional."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Texto'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {(isLoading || generatedScript || error) && (
           <Card>
            <CardHeader>
                <CardTitle>Texto Gerado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {generatedScript && (
                    <>
                        <Textarea
                            readOnly
                            value={generatedScript}
                            className="min-h-[200px] text-base"
                        />
                         <p className="text-right text-sm text-muted-foreground">
                            Duração estimada: <strong>{estimatedSeconds} segundos</strong>
                        </p>
                    </>
                )}
            </CardContent>
           </Card>
        )}
      </div>
    </MainLayout>
  );
}

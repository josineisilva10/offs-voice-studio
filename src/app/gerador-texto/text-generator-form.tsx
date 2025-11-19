'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateTextFromPrompt } from '@/ai/flows/generate-text-from-prompt';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Por favor, descreva sua ideia com pelo menos 10 caracteres.',
  }),
});

export function TextGeneratorForm() {
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedText('');
    try {
      const result = await generateTextFromPrompt(values);
      setGeneratedText(result.generatedText);
    } catch (error) {
      console.error('Text generation failed:', error);
      toast({
        title: 'Erro na Geração',
        description: 'Não foi possível gerar o texto. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: 'Copiado!',
      description: 'O texto gerado foi copiado para a área de transferência.',
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sua Ideia</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descreva o que você precisa</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Crie um texto curto para um anúncio de rádio de 30 segundos sobre uma nova pizzaria na cidade, destacando a entrega rápida e a massa artesanal."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <Wand2 className="mr-2 h-4 w-4" />
                    Gerar Texto
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Card className="flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Texto Gerado</CardTitle>
          {generatedText && (
            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copiar</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Aguarde, a mágica está acontecendo...</span>
            </div>
          )}
          {!isLoading && !generatedText && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <span>O texto gerado pela IA aparecerá aqui.</span>
            </div>
          )}
          {generatedText && (
            <Textarea
              readOnly
              value={generatedText}
              className="min-h-[200px] flex-grow bg-muted/50"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

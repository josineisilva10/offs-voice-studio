'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { summarizeTextToVoicePrompt } from '@/ai/flows/summarize-text-to-voice-prompt';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  text: z.string().min(20, { message: 'O texto deve ter pelo menos 20 caracteres.' }),
});

export function SummarizeTextForm() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult('');
    try {
      const response = await summarizeTextToVoicePrompt(values);
      setResult(response.prompt);
      toast({ title: 'Texto Resumido com Sucesso!' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao resumir o texto.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto de Entrada</FormLabel>
                <FormControl>
                  <Textarea placeholder="Insira um texto longo para ser resumido..." {...field} className="min-h-[150px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Testar Função
          </Button>
        </form>
      </Form>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { GenerateTextForm } from './generate-text-form';
import { GenerateVoiceForm } from './generate-voice-form';
import { SummarizeTextForm } from './summarize-text-form';

export default function FuncoesIAPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Funções de IA"
        description="Teste todas as funções de IA disponíveis no seu aplicativo."
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-headline text-lg">
            Gerar Texto a partir de um Prompt
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Esta função recebe um prompt (uma instrução em texto) e utiliza um modelo de linguagem para gerar um texto completo com base nessa instrução.
                </p>
                <GenerateTextForm />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="font-headline text-lg">
            Gerar Voz a partir de Texto
          </AccordionTrigger>
          <AccordionContent>
             <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Esta função converte uma string de texto em áudio. Você pode selecionar diferentes vozes para a narração. O áudio é retornado como um arquivo WAV.
                </p>
                <GenerateVoiceForm />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="font-headline text-lg">
            Resumir Texto para Prompt de Voz
          </AccordionTrigger>
          <AccordionContent>
             <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Esta função pega um bloco de texto longo e o resume em um prompt conciso e claro, ideal para ser usado por um modelo de geração de voz.
                </p>
                <SummarizeTextForm />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

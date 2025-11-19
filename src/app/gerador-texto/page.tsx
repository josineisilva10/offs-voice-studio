import { PageHeader } from '@/components/page-header';
import { TextGeneratorForm } from './text-generator-form';

export default function GeradorTextoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gerador de Texto"
        description="Precisa de ajuda para criar seu script? Descreva sua ideia e nossa IA irá gerar um texto para você."
      />
      <TextGeneratorForm />
    </div>
  );
}

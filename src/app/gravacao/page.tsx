import { PageHeader } from '@/components/page-header';
import { VoiceGenerationForm } from './voice-generation-form';
import { voices } from '@/lib/data';

export default function GravacaoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gravação de Voz"
        description="Digite seu texto, escolha uma voz e gere seu áudio em segundos."
      />
      <VoiceGenerationForm availableVoices={voices} />
    </div>
  );
}

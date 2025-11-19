import { PageHeader } from '@/components/page-header';
import { voices } from '@/lib/data';
import { VoiceList } from './voice-list';

export default function VozesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Lista de Vozes"
        description="Explore nossa seleção de vozes de alta qualidade e encontre a perfeita para seu projeto."
      />
      <VoiceList voices={voices} />
    </div>
  );
}

'use client';

import { PageHeader } from '@/components/page-header';
import { VoiceList } from './voice-list';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { VoiceActor } from '@/lib/data';
import { useMemo } from 'react';

export default function VozesPage() {
  const firestore = useFirestore();
  const voiceActorsRef = useMemo(() => collection(firestore, 'voice_actors'), [firestore]);
  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsRef);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Lista de Vozes"
        description="Explore nossa seleção de vozes de alta qualidade e encontre a perfeita para seu projeto."
      />
      <VoiceList voices={voiceActors || []} isLoading={isLoading} />
    </div>
  );
}

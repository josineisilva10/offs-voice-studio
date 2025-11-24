'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { VoiceList } from './voice-list';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { VoiceActor } from '@/lib/data';
import { staticVoiceActors } from '@/lib/data';

export default function VozesPage() {
  const firestore = useFirestore();
  const voiceActorsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'voice_actors') : null),
    [firestore]
  );
  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsRef);

  const combinedVoices = useMemo(() => {
    const allVoices = [...staticVoiceActors];
    const staticIds = new Set(staticVoiceActors.map(v => v.id));
    
    if (voiceActors) {
      voiceActors.forEach(dbVoice => {
        if (!staticIds.has(dbVoice.id)) {
          allVoices.push(dbVoice);
        }
      });
    }

    return allVoices;
  }, [voiceActors]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Lista de Vozes"
        description="Explore nossa seleção de vozes de alta qualidade e encontre a perfeita para seu projeto."
      />
      <VoiceList voices={combinedVoices} isLoading={isLoading} />
    </div>
  );
}

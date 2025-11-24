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
  const { data: voiceActorsFromDB, isLoading } = useCollection<VoiceActor>(voiceActorsRef);

  const combinedVoices = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const dbActorsMap = new Map(voiceActorsFromDB?.map(actor => [actor.id, actor]));

    const mergedActors = staticVoiceActors.map(staticActor => {
      const dbActor = dbActorsMap.get(staticActor.id);
      if (dbActor) {
        // an entry for this static actor exists in the db, so remove it from the map
        dbActorsMap.delete(staticActor.id);
        // and return a merged object, with db values taking precedence
        return { ...staticActor, ...dbActor };
      }
      // otherwise, just return the static actor
      return staticActor;
    });

    const remainingDbActors = Array.from(dbActorsMap.values());
    
    return [...mergedActors, ...remainingDbActors];
    
  }, [voiceActorsFromDB, isLoading]);

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

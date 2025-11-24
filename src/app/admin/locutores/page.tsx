
'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { LocutoresAdminList } from './locutores-admin-list';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { VoiceActor } from '@/lib/data';
import { staticVoiceActors } from '@/lib/data';

export default function AdminLocutoresPage() {
  const firestore = useFirestore();
  const voiceActorsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'voice_actors') : null),
    [firestore]
  );
  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsRef);

  const combinedActors = useMemo(() => {
    // Start with a copy of static actors
    const allActors = [...staticVoiceActors];
    const staticIds = new Set(allActors.map(v => v.id));

    // Add actors from Firestore if they don't already exist in the static list
    if (voiceActors) {
      voiceActors.forEach(dbActor => {
        if (!staticIds.has(dbActor.id)) {
          allActors.push(dbActor);
          staticIds.add(dbActor.id); // Also add to set to handle potential duplicates in db
        } else {
          // Optional: If you want DB data to override static data for the same ID
          const index = allActors.findIndex(a => a.id === dbActor.id);
          if (index !== -1) {
            allActors[index] = { ...allActors[index], ...dbActor };
          }
        }
      });
    }

    return allActors;
  }, [voiceActors]);


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gerenciamento de Locutores"
        description="Adicione, edite e gerencie os locutores da sua plataforma."
      />
      <LocutoresAdminList voiceActors={combinedActors} isLoading={isLoading} />
    </div>
  );
}

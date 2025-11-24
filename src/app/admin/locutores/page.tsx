
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
  const { data: voiceActorsFromDB, isLoading } = useCollection<VoiceActor>(voiceActorsRef);

  const combinedActors = useMemo(() => {
    // Create a map of voice actors from the database for easy lookup.
    const dbActorsMap = new Map(voiceActorsFromDB?.map(actor => [actor.id, actor]));

    // Use staticVoiceActors as the base list and merge data from the database.
    const mergedActors = staticVoiceActors.map(staticActor => {
      const dbActor = dbActorsMap.get(staticActor.id);
      if (dbActor) {
        // If the actor exists in the DB, merge static data with DB data, prioritizing DB data.
        // Also, remove it from the map so we don't add it again later.
        dbActorsMap.delete(staticActor.id);
        return { ...staticActor, ...dbActor };
      }
      return staticActor;
    });

    // Add any remaining actors from the database that were not in the static list.
    const remainingDbActors = Array.from(dbActorsMap.values());
    
    return [...mergedActors, ...remainingDbActors];
    
  }, [voiceActorsFromDB]);


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

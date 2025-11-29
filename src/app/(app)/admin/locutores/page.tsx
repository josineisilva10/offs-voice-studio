// src/app/(app)/admin/locutores/page.tsx
'use client';

import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { VoiceActor } from '@/lib/types';
import { VoiceActorCard } from '@/components/admin/VoiceActorCard';

export default function AdminLocutoresPage() {
  const { firestore } = useFirebase();

  const voiceActorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voice_actors'), orderBy('name'));
  }, [firestore]);

  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsQuery);

  if (isLoading) {
    return <p>Carregando locutores...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gerenciamento de Locutores</h1>
      
      <div className="space-y-4">
        {voiceActors && voiceActors.length > 0 ? (
          voiceActors.map((actor) => (
            <VoiceActorCard key={actor.id} actor={actor} />
          ))
        ) : (
          <p>Nenhum locutor encontrado.</p>
        )}
      </div>
    </div>
  );
}

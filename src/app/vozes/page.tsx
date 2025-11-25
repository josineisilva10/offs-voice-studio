
'use client';

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useCollection, useFirestore } from '@/firebase';
import { collection, Query, CollectionReference } from 'firebase/firestore';
import { staticVoices, type Voice } from '@/lib/data';
import VoiceCard from './voice-card';

export default function VozesPage() {
  const firestore = useFirestore();

  // Query to get voices from Firestore
  const voicesQuery = useMemo(() => {
    if (firestore) {
      return collection(
        firestore,
        'voices'
      ) as CollectionReference<Voice>;
    }
    return undefined;
  }, [firestore]);

  const { data: dbVoices, isLoading } = useCollection<Voice>(voicesQuery);

  // Merge static voices with voices from the database
  const allVoices = useMemo(() => {
    const voicesMap = new Map<string, Voice>();

    // Add static voices first
    staticVoices.forEach((voice) => {
      voicesMap.set(voice.id, voice);
    });

    // Overwrite with database voices if they exist
    dbVoices?.forEach((voice) => {
      voicesMap.set(voice.id, voice);
    });

    return Array.from(voicesMap.values());
  }, [dbVoices]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Lista de Vozes</h1>
          <p className="text-muted-foreground">
            Explore nossos locutores e vozes de IA. Ouça as demonstrações e escolha a ideal para o seu projeto.
          </p>
        </div>

        {/* TODO: Add Filters */}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
               <div key={i} className="flex flex-col space-y-3">
                 <div className="h-[280px] w-full rounded-xl bg-muted/40 animate-pulse" />
               </div>
            ))}
          </div>
        )}

        {!isLoading && allVoices.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Nenhuma voz encontrada.</p>
          </div>
        )}

        {!isLoading && allVoices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allVoices.map((voice) => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

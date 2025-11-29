// src/app/(app)/vozes/page.tsx
'use client';

import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { VoiceActor } from '@/lib/types';
import { VoiceCard } from '@/components/vozes/VoiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useState } from 'react';

export default function VozesPage() {
  const { firestore } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');

  const voiceActorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'voice_actors'), orderBy('name'));
  }, [firestore]);

  const { data: voiceActors, isLoading } = useCollection<VoiceActor>(voiceActorsQuery);

  const filteredActors = voiceActors?.filter(actor => 
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.styleTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Nossas Vozes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Encontre o locutor perfeito para o seu projeto.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input 
            placeholder="Buscar por nome ou estilo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button variant="outline">
          Filtros Avançados
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <p>Carregando vozes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActors && filteredActors.length > 0 ? (
            filteredActors.map((actor) => (
              <VoiceCard key={actor.id} actor={actor} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Nenhuma voz encontrada com os critérios selecionados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

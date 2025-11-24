'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { VoiceGenerationForm } from './voice-generation-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { VoiceActor } from '@/lib/data';
import { staticVoiceActors, recordingStyles, locutionStyles } from '@/lib/data';

export default function GravacaoPage() {
  const firestore = useFirestore();
  const voiceActorsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'voice_actors') : null),
    [firestore]
  );
  const { data: voiceActors } = useCollection<VoiceActor>(voiceActorsRef);

  const combinedVoices = useMemo(() => {
    const allVoices = [...staticVoiceActors].map(v => ({
      id: v.id,
      name: v.name,
      sampleAudioUrl: v.sampleAudioUrl,
      // Add other required fields from `Voice` type if needed
      gender: v.name.includes('a') || v.name.includes('e') ? 'Feminino' : 'Masculino', // simple guess
      description: v.description,
      profilePictureUrl: v.imageUrl,
    }));
    
    const staticIds = new Set(staticVoiceActors.map(v => v.id));

    if (voiceActors) {
      voiceActors.forEach(dbVoice => {
        if (!staticIds.has(dbVoice.id)) {
          allVoices.push({
             id: dbVoice.id,
             name: dbVoice.name,
             sampleAudioUrl: dbVoice.sampleAudioUrl,
             gender: 'Masculino', // Adjust as needed
             description: dbVoice.description,
             profilePictureUrl: dbVoice.imageUrl
          });
        }
      });
    }

    return allVoices;
  }, [voiceActors]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gravação de Voz"
        description="Digite seu texto, escolha uma voz e gere seu áudio em segundos."
      />
      <VoiceGenerationForm
        availableVoices={combinedVoices}
        recordingStyles={recordingStyles}
        locutionStyles={locutionStyles}
      />
    </div>
  );
}

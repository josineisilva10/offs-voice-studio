'use client';

import { useState } from 'react';
import type { Voice } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Square } from 'lucide-react';
import { generateVoiceFromText } from '@/ai/flows/generate-voice-from-text';

type VoiceListProps = {
  voices: Voice[];
};

export function VoiceList({ voices }: VoiceListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlaySample = async (voice: Voice) => {
    if (playingId === voice.id && audio) {
      audio.pause();
      setPlayingId(null);
      return;
    }
    
    if (audio) {
      audio.pause();
    }
    
    setLoadingId(voice.id);
    setPlayingId(null);

    try {
      const result = await generateVoiceFromText({ text: voice.sampleText, voiceName: voice.id });
      const newAudio = new Audio(result.audioDataUri);
      newAudio.play();
      newAudio.onended = () => {
        setPlayingId(null);
      };
      setAudio(newAudio);
      setPlayingId(voice.id);
    } catch (error) {
      console.error('Failed to play sample:', error);
    } finally {
      setLoadingId(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {voices.map((voice) => (
        <Card key={voice.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">{voice.name}</CardTitle>
              <div className="text-sm px-2 py-1 bg-secondary rounded-md">{voice.gender}</div>
            </div>
            <CardDescription>{voice.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handlePlaySample(voice)}
              disabled={loadingId !== null && loadingId !== voice.id}
            >
              {loadingId === voice.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : playingId === voice.id ? (
                <Square className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              <span>{loadingId === voice.id ? 'Carregando...' : playingId === voice.id ? 'Parar' : 'Ouvir Demonstração'}</span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Voice } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Square } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

type VoiceListProps = {
  voices: Voice[];
};

export function VoiceList({ voices }: VoiceListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlaySample = (voice: Voice) => {
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
      const newAudio = new Audio(voice.sampleAudioUrl);
      
      newAudio.oncanplaythrough = () => {
        newAudio.play();
        setLoadingId(null);
        setPlayingId(voice.id);
      };

      newAudio.onended = () => {
        setPlayingId(null);
      };

      newAudio.onerror = () => {
        console.error('Failed to play sample:', voice.sampleAudioUrl);
        toast({
            title: 'Erro ao Tocar Amostra',
            description: 'Não foi possível carregar o áudio. Verifique se a URL está correta.',
            variant: 'destructive',
        });
        setLoadingId(null);
      }

      setAudio(newAudio);

    } catch (error) {
      console.error('Failed to create audio object:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao tentar reproduzir a amostra.',
        variant: 'destructive',
      });
      setLoadingId(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {voices.map((voice) => (
        <Card key={voice.id} className="flex flex-col">
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage asChild src={voice.profilePictureUrl} data-ai-hint="person face">
                <Image src={voice.profilePictureUrl} alt={voice.name} width={96} height={96} />
              </AvatarImage>
              <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className='w-full'>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline">{voice.name}</CardTitle>
                    <div className="text-sm px-2 py-1 bg-secondary rounded-md">{voice.gender}</div>
                </div>
                <CardDescription className="text-left mt-2">{voice.description}</CardDescription>
            </div>
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

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Voice } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Square } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// New component for the animated sound wave
function SoundWave({ isPlaying }: { isPlaying: boolean }) {
  // More bars for a bigger wave
  const bars = Array.from({ length: 30 });
  return (
    <div className={cn(
        "flex h-12 w-full items-end gap-1 transition-opacity duration-300",
        isPlaying ? "opacity-100" : "opacity-0"
    )}>
      {bars.map((_, i) => (
         <span
            key={i}
            className={cn(
                'w-1 bg-primary/70',
                isPlaying && 'animate-wave'
            )}
            style={{ 
                animationDelay: `${i * 40}ms`,
                animationDuration: `${Math.random() * (1.5 - 0.8) + 0.8}s`
            }}
      ></span>
      ))}
    </div>
  );
}


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
      };

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

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);
  
  return (
    <div className="space-y-4">
      {voices.map((voice) => (
        <Card key={voice.id}>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-4 w-1/3">
                     <Avatar className="w-16 h-16">
                        <AvatarImage asChild src={voice.profilePictureUrl} data-ai-hint="person face">
                            <Image src={voice.profilePictureUrl} alt={voice.name} width={64} height={64} />
                        </AvatarImage>
                        <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1 truncate'>
                        <h3 className="font-headline text-lg font-semibold">{voice.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{voice.description}</p>
                    </div>
                </div>

                <div className="flex-1 px-4 flex items-center justify-center">
                    <SoundWave isPlaying={playingId === voice.id} />
                </div>

                <div className="flex items-center">
                    <Button 
                        variant="outline" 
                        size="icon"
                        className="w-12 h-12"
                        onClick={() => handlePlaySample(voice)}
                        disabled={loadingId !== null && loadingId !== voice.id}
                        aria-label={`Ouvir ${voice.name}`}
                    >
                        {loadingId === voice.id ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : playingId === voice.id ? (
                            <Square className="h-6 w-6" />
                        ) : (
                            <Play className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Square, Clock, Wifi, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { VoiceActor } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { VoiceActorDemos } from './voice-actor-demos';


type VoiceListProps = {
  voices: VoiceActor[];
  isLoading: boolean;
};

export function VoiceList({ voices, isLoading }: VoiceListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlaySample = (e: React.MouseEvent, voice: VoiceActor) => {
    e.stopPropagation(); // Prevent accordion from toggling
    if (!voice.sampleAudioUrl) {
        toast({
            title: 'Áudio não disponível',
            description: 'Este locutor não possui um áudio de demonstração.',
            variant: 'destructive',
        });
        return;
    }

    const sampleId = `sample-${voice.id}`;
    if (playingId === sampleId && audio) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (audio) {
      audio.pause();
    }

    setLoadingId(sampleId);
    setPlayingId(null);

    try {
      const newAudio = new Audio(voice.sampleAudioUrl);

      newAudio.oncanplaythrough = () => {
        newAudio.play();
        setLoadingId(null);
        setPlayingId(sampleId);
      };

      newAudio.onended = () => {
        setPlayingId(null);
      };

      newAudio.onerror = (err) => {
        console.error('Failed to play sample:', voice.sampleAudioUrl, err);
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

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);
  
  if (isLoading) {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                         <Skeleton className="w-12 h-12 rounded-md" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  return (
     <Accordion type="single" collapsible className="w-full space-y-4">
      {voices.map((voice) => (
        <AccordionItem value={voice.id} key={voice.id} className="border-b-0">
           <Card>
            <AccordionTrigger className="w-full p-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-4 w-1/3">
                        <Avatar className="w-16 h-16">
                            <AvatarImage asChild src={voice.imageUrl || `https://picsum.photos/seed/${voice.id}/100/100`} data-ai-hint="person face">
                                <Image src={voice.imageUrl || `https://picsum.photos/seed/${voice.id}/100/100`} alt={voice.name} width={64} height={64} />
                            </AvatarImage>
                            <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='space-y-1 truncate text-left'>
                            <h3 className="font-headline text-lg font-semibold">{voice.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{voice.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                {voice.status && (
                                    <div className={cn("flex items-center gap-1.5", voice.status === 'online' ? 'text-green-500' : 'text-amber-500')}>
                                        {voice.status === 'online' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                                        <span className="capitalize">{voice.status}</span>
                                    </div>
                                )}
                                {voice.deliveryTimeMinutes != null && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Entrega em até {voice.deliveryTimeMinutes} min</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 px-4 flex items-center justify-center">
                       {/* Placeholder for future sound wave */}
                    </div>

                    <div className="flex items-center pr-4">
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="w-12 h-12"
                            onClick={(e) => handlePlaySample(e, voice)}
                            disabled={(loadingId !== null && loadingId !== `sample-${voice.id}`) || !voice.sampleAudioUrl}
                            aria-label={`Ouvir ${voice.name}`}
                        >
                            {loadingId === `sample-${voice.id}` ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : playingId === `sample-${voice.id}` ? (
                                <Square className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="p-4 pt-0">
                    <VoiceActorDemos voiceActorId={voice.id} />
                </div>
            </AccordionContent>
            </Card>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

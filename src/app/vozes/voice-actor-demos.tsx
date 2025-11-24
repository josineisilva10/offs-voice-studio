'use client';

import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { VoiceActorDemo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Square, FileAudio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type VoiceActorDemosProps = {
  voiceActorId: string;
};

export function VoiceActorDemos({ voiceActorId }: VoiceActorDemosProps) {
  const firestore = useFirestore();
  const demosRef = useMemoFirebase(
    () => collection(firestore, 'voice_actors', voiceActorId, 'demos'),
    [firestore, voiceActorId]
  );
  const { data: demos, isLoading } = useCollection<VoiceActorDemo>(demosRef);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayDemo = (demo: VoiceActorDemo) => {
    if (!demo.audioUrl) {
      toast({
        title: 'Áudio não disponível',
        description: 'Esta demonstração não possui um áudio.',
        variant: 'destructive',
      });
      return;
    }

    if (playingId === demo.id && audio) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (audio) {
      audio.pause();
    }

    setLoadingId(demo.id);
    setPlayingId(null);

    try {
      const newAudio = new Audio(demo.audioUrl);
      newAudio.oncanplaythrough = () => {
        newAudio.play();
        setLoadingId(null);
        setPlayingId(demo.id);
      };
      newAudio.onended = () => {
        setPlayingId(null);
      };
      newAudio.onerror = (e) => {
        console.error('Failed to play demo:', demo.audioUrl, e);
        toast({
          title: 'Erro ao Tocar Demo',
          description: 'Não foi possível carregar o áudio da demonstração.',
          variant: 'destructive',
        });
        setLoadingId(null);
      };
      setAudio(newAudio);
    } catch (error) {
      console.error('Failed to create audio object:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao tentar reproduzir a demo.',
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
        <div className="space-y-3 px-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        </div>
    )
  }

  if (!demos || demos.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        Nenhuma demonstração encontrada para este locutor.
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t pt-4">
        <h4 className="font-semibold text-md px-4">Demonstrações</h4>
        <ul className="space-y-2">
            {demos.map((demo) => (
                <li key={demo.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                    <FileAudio className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">{demo.title}</p>
                        <p className="text-sm text-muted-foreground">{demo.description}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayDemo(demo)}
                        disabled={loadingId !== null && loadingId !== demo.id}
                        aria-label={`Ouvir ${demo.title}`}
                    >
                        {loadingId === demo.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : playingId === demo.id ? (
                            <Square className="h-5 w-5" />
                        ) : (
                            <Play className="h-5 w-5" />
                        )}
                    </Button>
                </li>
            ))}
        </ul>
    </div>
  );
}


'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Pause, Hourglass, Mic, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Voice } from '@/lib/data';

interface VoiceCardProps {
  voice: Voice;
}

const Waveform = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="relative flex h-10 w-full items-center justify-center gap-px overflow-hidden">
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-0.5 rounded-full bg-primary/50 transition-all",
          isPlaying ? "animate-wave" : "h-2 animate-wave-quiet",
        )}
        style={{ animationDelay: `${i * 0.05}s` }}
      />
    ))}
  </div>
);

export default function VoiceCard({ voice }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Pause all other audio elements before playing this one
        document.querySelectorAll('audio').forEach(audio => audio.pause());
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    // This effect ensures that if another audio starts playing, this one stops.
    const handleGlobalPause = (event: Event) => {
        if(event.target !== audio) {
            setIsPlaying(false);
        }
    };
    document.addEventListener('play', handleGlobalPause, true);


    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      document.removeEventListener('play', handleGlobalPause, true);
    };
  }, []);

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={voice.avatarUrl} alt={voice.name} />
            <AvatarFallback>{voice.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-base leading-tight">{voice.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                {voice.status === 'online' ? 
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                    <XCircle className="h-3 w-3 text-red-500" />
                }
              <span>{voice.status === 'online' ? 'Online' : 'Offline'}</span>
              <span className='px-1'>·</span>
              <Hourglass className="h-3 w-3" />
              <span>{voice.deliveryTime} min</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-1">
          {voice.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 bg-muted/40 p-4">
        {voice.demoUrl ? (
          <>
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isPlaying ? (
                <Pause className="mr-2 h-5 w-5" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              {isPlaying ? 'Pausar' : 'Ouvir Demo'}
            </Button>
            <Waveform isPlaying={isPlaying} />
            <audio ref={audioRef} src={voice.demoUrl} preload="none" />
          </>
        ) : (
          <Button variant="outline" size="lg" className="w-full" disabled>
             <Mic className="mr-2 h-5 w-5" />
             Demo Indisponível
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

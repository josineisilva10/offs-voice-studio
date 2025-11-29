// src/components/vozes/VoiceCard.tsx
'use client';

import type { VoiceActor } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceCardProps {
  actor: VoiceActor;
}

export function VoiceCard({ actor }: VoiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-1 relative h-full">
            <Image
              src={actor.avatarUrl}
              alt={actor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="col-span-2 p-4">
            <div className="flex items-center gap-2 mb-2">
               <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  actor.isOnline ? 'bg-green-500' : 'bg-gray-500'
                )}
              />
              <h3 className="text-lg font-bold truncate">{actor.name}</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {actor.styleTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Ouvir Demo
                </Button>
                 <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                    Ver Detalhes
                </Button>
            </div>
           
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-bold text-sidebar-primary tracking-tighter',
        className
      )}
    >
      <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Waves className="size-5" />
      </div>
      <span className="font-headline text-sidebar-foreground">VozGenius</span>
    </div>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/provider';
import { getAuth, signOut } from 'firebase/auth';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function UserProfile() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: 'Você saiu!',
        description: 'Até a próxima!',
      });
      // O AuthGuard irá redirecionar para /login automaticamente
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erro ao Sair',
        description: 'Não foi possível fazer o logout. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  if (isUserLoading) {
    return (
        <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-col gap-1 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
            </div>
        </div>
    )
  }

  if (!user) {
    return null; // Ou um placeholder se preferir
  }


  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2">
      <Avatar className="size-8">
        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="person face" />
        <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="font-medium truncate">{user.displayName || 'Usuário'}</span>
        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto group-data-[collapsible=icon]:hidden"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}

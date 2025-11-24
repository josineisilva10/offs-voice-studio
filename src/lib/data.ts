export interface VoiceActor {
  id: string;
  name: string;
  avatarUrl?: string;
  tags: string[];
  demoUrl: string;
  gender: 'male' | 'female' | 'other';
  deliveryTime?: number; // in minutes
  status?: 'online' | 'offline';
  isStatic?: boolean; // To differentiate from DB actors
}

export const staticVoiceActors: VoiceActor[] = [
  {
    id: 'marcos-vinicius',
    name: 'MARCOS VINÍCIUS',
    avatarUrl: `https://i.pravatar.cc/150?u=marcos-vinicius`,
    tags: ['impacto', 'varejo', 'padrão'],
    demoUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-611847233-7c1f1.firebasestorage.app/o/MARCOS%20VIN%C3%8DCIUS_principal.mp3?alt=media&token=e618408f-4fab-4151-abae-d92f836e29b4',
    gender: 'male',
    isStatic: true,
  },
  {
    id: 'algenib',
    name: 'Algenib (IA)',
    avatarUrl: `https://i.pravatar.cc/150?u=algenib`,
    tags: ['IA', 'robótica', 'calma'],
    demoUrl: '',
    gender: 'male',
    isStatic: true,
  },
  {
    id: 'antares',
    name: 'Antares (IA)',
    avatarUrl: `https://i.pravatar.cc/150?u=antares`,
    tags: ['IA', 'jovem', 'dinâmica'],
    demoUrl: '',
    gender: 'female',
    isStatic: true,
  },
  {
    id: 'achernar',
    name: 'Achernar (IA)',
    avatarUrl: `https://i.pravatar.cc/150?u=achernar`,
    tags: ['IA', 'madura', 'elegante'],
    demoUrl: '',
    gender: 'female',
    isStatic: true,
  }
];

    
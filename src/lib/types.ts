import { type Timestamp } from 'firebase/firestore';

export interface RecordingOrder {
  id: string;
  userId: string;
  title: string;
  recordingType: 'off' | 'produzida';
  recordingStyle: string;
  voiceActorId: string;
  voiceActorName: string;
  narrationStyle: string;
  script: string;
  usedCredits: number;
  status: 'Aguardando entrega' | 'Em produção' | 'Concluído' | 'Entregue';
  createdAt: Timestamp;
  finalAudioUrl?: string;
}

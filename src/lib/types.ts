export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    whatsAppNumber: string;
    email: string;
    creditBalance: number;
};

export type VoiceActor = {
    id: string;
    name: string;
    avatarUrl: string;
    demoAudioUrl: string;
    styleTags: string[];
    isOnline: boolean;
    estimatedDeliveryTime: string;
    biography: string;
};

export type RecordingOrder = {
    id: string;
    userId: string;
    voiceActorId: string;
    voiceActorName: string;
    title: string;
    type: 'Off' | 'Produzida';
    style: 'Abertura' | 'Comercial' | 'Chamada para festa' | 'Vinhetas';
    locutionStyle: 'Padrão' | 'Impacto' | 'Varejo' | 'Jovem' | 'Outros';
    otherLocutionStyle?: string;
    script: string;
    estimatedDurationSeconds: number;
    creditsUsed: number;
    referenceAudioUrl?: string;
    status: 'Aguardando entrega' | 'Em produção' | 'Concluído';
    orderDate: string; // ISO string
};

export type CreditPackage = {
    id: string;
    title: string;
    creditAmount: number;
    price: number;
    description: string;
    packageType: 'Office' | 'Produzida';
};

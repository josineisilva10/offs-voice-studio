export type Voice = {
  id: string;
  name: string;
  gender: 'Masculino' | 'Feminino';
  description: string;
  sampleText: string;
};

export const voices: Voice[] = [
  { id: 'Algenib', name: 'Algenib', gender: 'Feminino', description: 'Voz feminina, clara e profissional.', sampleText: 'Olá, eu sou Algenib. Posso transformar seu texto em áudio com clareza e profissionalismo.' },
  { id: 'Antares', name: 'Antares', gender: 'Masculino', description: 'Voz masculina, grave e confiante.', sampleText: 'Saudações, sou Antares. Use minha voz para dar um tom de autoridade às suas gravações.' },
  { id: 'Arcturus', name: 'Arcturus', gender: 'Masculino', description: 'Voz masculina, amigável e energética.', sampleText: 'E aí, aqui é Arcturus! Pronto para dar vida e energia ao seu conteúdo.' },
  { id: 'Rigel', name: 'Rigel', gender: 'Masculino', description: 'Voz masculina, calma e narrativa.', sampleText: 'Eu sou Rigel. Ideal para narrações e histórias que precisam de um toque sereno.' },
  { id: 'Spica', name: 'Spica', gender: 'Feminino', description: 'Voz feminina, jovem e dinâmica.', sampleText: 'Oi, eu sou a Spica! Minha voz é perfeita para projetos modernos e dinâmicos.' },
  { id: 'Vega', name: 'Vega', gender: 'Feminino', description: 'Voz feminina, madura e sofisticada.', sampleText: 'Meu nome é Vega. Empresto minha sofisticação para locuções que exigem elegância.' },
  { id: 'Sirius', name: 'Sirius', gender: 'Masculino', description: 'Voz masculina, versátil e neutra.', sampleText: 'Aqui é Sirius. Uma voz versátil para qualquer tipo de projeto que você imaginar.' },
];

export type Order = {
  id: string;
  text: string;
  voice: string;
  date: string;
  status: 'Concluído' | 'Processando' | 'Falhou';
};

export const orders: Order[] = [
  { id: 'VG001', text: 'Bem-vindo ao VozGenius, a sua plataforma...', voice: 'Algenib', date: '2024-07-28', status: 'Concluído' },
  { id: 'VG002', text: 'Promoção imperdível! Compre agora e...', voice: 'Arcturus', date: '2024-07-27', status: 'Concluído' },
  { id: 'VG003', text: 'Este é um tutorial sobre como usar nossa...', voice: 'Rigel', date: '2024-07-27', status: 'Processando' },
  { id: 'VG004', text: 'Anúncio importante para todos os clientes...', voice: 'Antares', date: '2024-07-26', status: 'Concluído' },
  { id: 'VG005', text: 'Falha na geração do áudio. Por favor, tente...', voice: 'Spica', date: '2024-07-25', status: 'Falhou' },
];

export type CreditPackage = {
  id: number;
  credits: number;
  price: number;
  bonus?: string;
  popular?: boolean;
};

export const creditPackages: CreditPackage[] = [
  { id: 1, credits: 100, price: 19.90 },
  { id: 2, credits: 250, price: 44.90, bonus: '+10% Bônus' },
  { id: 3, credits: 500, price: 79.90, bonus: '+15% Bônus', popular: true },
  { id: 4, credits: 1000, price: 149.90, bonus: '+20% Bônus' },
];

export type RecordingStyle = {
  id: string;
  name: string;
};

export const recordingStyles: RecordingStyle[] = [
    { id: 'abertura', name: 'Abertura' },
    { id: 'comercial', name: 'Comercial' },
    { id: 'chamada_festa', name: 'Chamada para Festa' },
    { id: 'vinhetas', name: 'Vinhetas' },
];

export type LocutionStyle = {
  id: string;
  name: string;
};

export const locutionStyles: LocutionStyle[] = [
    { id: 'padrao', name: 'Padrão' },
    { id: 'impacto', name: 'Impacto' },
    { id: 'varejo', name: 'Varejo' },
    { id: 'jovem', name: 'Jovem' },
    { id: 'outros', name: 'Outros' },
];

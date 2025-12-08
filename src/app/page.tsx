
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, Send } from 'lucide-react';

// Dados dos locutores (baseado em vozlocutor.com.br)
const locutores = [
  { id: 1, nome: 'Adriano Impacto', demoUrl: '' },
  { id: 2, nome: 'Adriano Jovem', demoUrl: '' },
  { id: 3, nome: 'Adriano Padrão', demoUrl: '' },
  { id: 4, nome: 'Alessandro Varejo', demoUrl: '' },
  { id: 5, nome: 'Alexandre Varejo', demoUrl: '' },
  { id: 6, nome: 'Alex Impacto', demoUrl: '' },
  { id: 7, nome: 'Bruno Varejo', demoUrl: '' },
  { id: 8, nome: 'Carlos Varejo', demoUrl: '' },
  { id: 9, nome: 'Silvia Fogaça', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1499&v=1' },
  { id: 10, nome: 'Charles Helfer', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1875&v=1' },
];

export default function Home() {
  const [textoCliente, setTextoCliente] = useState('');
  const [locutorSelecionado, setLocutorSelecionado] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);

  const tempoEstimado = useMemo(() => {
    if (!textoCliente.trim()) return 0;
    const palavras = textoCliente.trim().split(/\s+/).length;
    const segundos = Math.ceil(palavras / 2.5);
    return segundos;
  }, [textoCliente]);

  const handlePlayDemo = (demoUrl) => {
    if (!demoUrl) {
      alert('Áudio de demonstração não disponível.');
      return;
    }
    if (audioPlayer) {
      audioPlayer.pause();
      if (audioPlayer.src.includes(demoUrl)) {
        setAudioPlayer(null);
        return;
      }
    }
    const newAudio = new Audio(demoUrl);
    setAudioPlayer(newAudio);
    newAudio.play();
    newAudio.onended = () => setAudioPlayer(null);
  };

  const handleSolicitar = (locutor) => {
    setLocutorSelecionado(locutor);
    // Rola a página para a seção de texto
    document.getElementById('texto-cliente-secao')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleEnviarWhatsApp = () => {
    if (!locutorSelecionado) {
      alert('Por favor, selecione um locutor primeiro.');
      return;
    }
    if (!textoCliente.trim()) {
      alert('Por favor, insira o texto para a locução.');
      return;
    }

    const numeroWhatsApp = '5500000000000'; // SUBSTITUA PELO SEU NÚMERO DE WHATSAPP

    const mensagem = `
NOVA SOLICITAÇÃO DE LOCUÇÃO
• Locutor escolhido: ${locutorSelecionado.nome}
• Tempo estimado: ${tempoEstimado} segundos
• Texto enviado:
---
${textoCliente}
---
Aguardando orçamento final.
    `;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem.trim())}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        
        {/* Cabeçalho */}
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Neyzinho das Produções
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Locuções profissionais para comerciais, DJs, vinhetas e muito mais.
          </p>
        </header>

        <main className="space-y-12">
          {/* 1. Sessão: Lista de Locutores */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Locutores Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {locutores.map((locutor) => (
                <Card key={locutor.id} className={`bg-gray-800 border-gray-700 transition-all duration-300 ${locutorSelecionado?.id === locutor.id ? 'border-purple-500 ring-2 ring-purple-500' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{locutor.nome}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">Demonstração profissional</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={() => handlePlayDemo(locutor.demoUrl)} className="flex-1 bg-gray-700 hover:bg-gray-600">
                        <PlayCircle className="mr-2 h-4 w-4" /> 
                        {audioPlayer && audioPlayer.src.includes(locutor.demoUrl) && !audioPlayer.paused ? 'Parar' : 'Ouvir Demo'}
                      </Button>
                      <Button onClick={() => handleSolicitar(locutor)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 2. Sessão: Texto do Cliente */}
          <section id="texto-cliente-secao">
            <h2 className="text-3xl font-bold text-center mb-8">Cole seu texto aqui</h2>
            <Textarea
              className="w-full min-h-[200px] bg-gray-800 border-gray-700 text-white text-base p-4 rounded-lg focus:ring-purple-500"
              placeholder="Digite ou cole aqui o roteiro da sua locução..."
              value={textoCliente}
              onChange={(e) => setTextoCliente(e.target.value)}
            />
            <div className="text-center mt-4 text-lg">
              <span className="font-semibold">Tempo estimado:</span> {tempoEstimado} segundos
            </div>
          </section>

          {/* 3. Sessão: Regras de Preço */}
          <section>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Regras de Preço</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-2">
                <p>• Cada 40 segundos de locução <span className="font-bold text-green-400">PRODUZIDA</span> = R$ 15,00</p>
                <p>• Cada 40 segundos de locução <span className="font-bold text-yellow-400">OFF (só a voz)</span> = R$ 7,00</p>
                <p className="text-sm text-gray-400">O valor é proporcional. Por exemplo, uma locução de 80 segundos custará o dobro do valor base.</p>
              </CardContent>
            </Card>
          </section>

          {/* 4. Sessão: Botão Final */}
          <section className="text-center">
            <Button size="lg" onClick={handleEnviarWhatsApp} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
              <Send className="mr-3 h-5 w-5" />
              Solicitar pelo WhatsApp
            </Button>
          </section>
        </main>

        {/* Rodapé */}
        <footer className="text-center mt-12 py-6 border-t border-gray-800">
          <p className="font-bold text-lg">Neyzinho das Produções</p>
          <p className="text-sm text-gray-500">Qualidade e rapidez para sua locução profissional.</p>
        </footer>
      </div>
    </div>
  );
}

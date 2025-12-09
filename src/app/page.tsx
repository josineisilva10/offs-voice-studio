
'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { PlayCircle, Send, FileAudio } from 'lucide-react';

// Dados dos locutores
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
  const [locutorSelecionado, setLocutorSelecionado] = useState<(typeof locutores[0]) | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Estados para os novos campos
  const [estiloGravacao, setEstiloGravacao] = useState('');
  const [estiloLocucao, setEstiloLocucao] = useState('');
  const [estiloLocucaoOutro, setEstiloLocucaoOutro] = useState('');
  const [tipoGravacao, setTipoGravacao] = useState('');
  const [instrucoesLocucao, setInstrucoesLocucao] = useState('');
  const [audioReferencia, setAudioReferencia] = useState<File | null>(null);


  const tempoEstimado = useMemo(() => {
    if (!textoCliente.trim()) return 0;
    const palavras = textoCliente.trim().split(/\s+/).length;
    const segundos = Math.ceil(palavras / 2.5);
    return segundos;
  }, [textoCliente]);

  const handlePlayDemo = (demoUrl: string) => {
    if (!demoUrl) {
      alert('Áudio de demonstração não disponível.');
      return;
    }
    if (audioPlayer) {
      audioPlayer.pause();
      if (audioPlayer.src.includes(demoUrl) && !audioPlayer.paused) {
        setAudioPlayer(null);
        return;
      }
    }
    const newAudio = new Audio(demoUrl);
    setAudioPlayer(newAudio);
    newAudio.play();
    newAudio.onended = () => setAudioPlayer(null);
  };

  const handleSolicitar = (locutor: typeof locutores[0]) => {
    setLocutorSelecionado(locutor);
    document.getElementById('texto-cliente-secao')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAudioReferencia(event.target.files[0]);
    }
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
    if (!estiloGravacao || !estiloLocucao || !tipoGravacao) {
      alert('Por favor, preencha todos os campos de estilo e tipo de gravação.');
      return;
    }

    const estiloLocucaoFinal = estiloLocucao === 'Outros' ? `Outros: ${estiloLocucaoOutro}` : estiloLocucao;

    const mensagem = `
*NOVA SOLICITAÇÃO DE LOCUÇÃO*
-----------------------------------------
*Locutor Escolhido:* ${locutorSelecionado.nome}
*Tempo Estimado:* ${tempoEstimado} segundos
-----------------------------------------
*Texto para Gravação:*
${textoCliente.trim()}
-----------------------------------------
*DETALHES DO PEDIDO:*
*Estilo de Gravação:* ${estiloGravacao}
*Estilo de Locução:* ${estiloLocucaoFinal}
*Tipo de Gravação:* ${tipoGravacao}
-----------------------------------------
*Instruções Adicionais:*
${instrucoesLocucao || 'Nenhuma'}
-----------------------------------------
${audioReferencia ? `*Áudio de referência:* Sim (será enviado separadamente)` : ''}

Aguardando orçamento final.
    `.trim().replace(/^\s+/gm, '');
    
    const numeroWhatsApp = "5591993584049";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');

    if (audioReferencia) {
        alert("Seu pedido foi preparado para o WhatsApp. Por favor, não se esqueça de anexar o arquivo de áudio de referência na conversa!");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Neyzinho das Produções
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Locuções profissionais para comerciais, DJs, vinhetas e muito mais.
          </p>
        </header>

        <main className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">1. Locutores Disponíveis</h2>
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

          <section id="texto-cliente-secao">
            <h2 className="text-3xl font-bold text-center mb-8">2. Cole seu texto aqui</h2>
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

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">3. Detalhes da Gravação</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Estilo de Gravação */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle>Estilo de Gravação</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={estiloGravacao} onValueChange={setEstiloGravacao}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Gravação Comercial" id="rg-comercial" /><Label htmlFor="rg-comercial">Gravação Comercial</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Vinheta" id="rg-vinheta" /><Label htmlFor="rg-vinheta">Vinheta</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Chamada de Festa" id="rg-festa" /><Label htmlFor="rg-festa">Chamada de Festa</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Abertura" id="rg-abertura" /><Label htmlFor="rg-abertura">Abertura</Label></div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Estilo de Locução */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle>Estilo de Locução</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={estiloLocucao} onValueChange={setEstiloLocucao}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Padrão" id="rl-padrao" /><Label htmlFor="rl-padrao">Padrão</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Impacto" id="rl-impacto" /><Label htmlFor="rl-impacto">Impacto</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Animado" id="rl-animado" /><Label htmlFor="rl-animado">Animado</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Varejo" id="rl-varejo" /><Label htmlFor="rl-varejo">Varejo</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Outros" id="rl-outros" /><Label htmlFor="rl-outros">Outros</Label></div>
                  </RadioGroup>
                  {estiloLocucao === 'Outros' && (
                    <Input type="text" placeholder="Descreva o estilo" value={estiloLocucaoOutro} onChange={(e) => setEstiloLocucaoOutro(e.target.value)} className="mt-2 bg-gray-700 border-gray-600"/>
                  )}
                </CardContent>
              </Card>

              {/* Tipo da Gravação */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle>Tipo da Gravação</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={tipoGravacao} onValueChange={setTipoGravacao}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Off (somente voz)" id="tipo-off" /><Label htmlFor="tipo-off">Off (somente voz)</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Produzida (voz + trilha + efeitos)" id="tipo-produzida" /><Label htmlFor="tipo-produzida">Produzida (com trilha e efeitos)</Label></div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
             <h2 className="text-3xl font-bold text-center mb-8">4. Instruções Adicionais</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader><CardTitle>Como você quer sua locução?</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Descreva o ritmo, velocidade, energia, referências e outros detalhes importantes."
                      className="w-full min-h-[150px] bg-gray-700 border-gray-600"
                      value={instrucoesLocucao}
                      onChange={(e) => setInstrucoesLocucao(e.target.value)}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader><CardTitle>Envie um áudio de referência</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4 text-sm">Grave ou envie um áudio com o estilo desejado ou com o modelo de referência.</p>
                     <Input id="audio" type="file" accept="audio/*" onChange={handleFileChange} className="text-gray-400 file:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 hover:file:bg-purple-700"/>
                      {audioReferencia && (
                        <div className="mt-4 text-green-400 flex items-center">
                          <FileAudio className="mr-2 h-4 w-4" />
                          <span>{audioReferencia.name} selecionado.</span>
                        </div>
                      )}
                  </CardContent>
                </Card>
             </div>
          </section>

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

          <section className="text-center">
            <Button size="lg" onClick={handleEnviarWhatsApp} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
              <Send className="mr-3 h-5 w-5" />
              Solicitar pelo WhatsApp
            </Button>
          </section>
        </main>

        <footer className="text-center mt-12 py-6 border-t border-gray-800">
          <p className="font-bold text-lg">Neyzinho das Produções</p>
          <p className="text-sm text-gray-500">Qualidade e rapidez para sua locução profissional.</p>
        </footer>
      </div>
    </div>
  );
}

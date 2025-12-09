
'use client';

import React, { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { PlayCircle, Send, FileAudio, Mic, Square, Trash2 } from 'lucide-react';

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

  // Estados para gravação de áudio
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Estado para o valor total
  const [valorTotal, setValorTotal] = useState(0);

  const tempoEstimado = useMemo(() => {
    if (!textoCliente.trim()) return 0;
    const palavras = textoCliente.trim().split(/\s+/).length;
    const segundos = Math.ceil(palavras / 2.5);
    return segundos;
  }, [textoCliente]);

  useEffect(() => {
    if (!tipoGravacao || tempoEstimado === 0) {
      setValorTotal(0);
      return;
    }

    let valor = 0;
    if (tipoGravacao === 'Produzida (voz + trilha + efeitos)') {
      if (tempoEstimado <= 40) {
        valor = 15;
      } else {
        valor = 15 + (tempoEstimado - 40) * 0.35;
      }
    } else if (tipoGravacao === 'Off (somente voz)') {
      if (tempoEstimado <= 40) {
        valor = 7;
      } else {
        valor = 7 + (tempoEstimado - 40) * 0.20;
      }
    }
    setValorTotal(valor);
  }, [tempoEstimado, tipoGravacao]);

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
    document.getElementById('detalhes-secao')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAudioReferencia(file);
      setRecordedAudioURL(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioFile = new File([audioBlob], 'gravacao_referencia.wav', { type: 'audio/wav' });
        setRecordedAudioURL(audioUrl);
        setAudioReferencia(audioFile);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordedAudioURL(null);
      setAudioReferencia(null);
    } catch (err) {
      console.error("Erro ao acessar o microfone:", err);
      alert("Não foi possível acessar o microfone. Por favor, verifique as permissões do seu navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    setAudioReferencia(null);
    setRecordedAudioURL(null);
    const fileInput = document.getElementById('audio-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

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
    const valorFormatado = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
*VALOR TOTAL ESTIMADO:* ${valorFormatado}
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
        
          <section id="locutores-secao">
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
                        Selecionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="detalhes-secao">
            <h2 className="text-3xl font-bold text-center mb-8">2. Detalhes da Gravação</h2>
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

          <section id="texto-cliente-secao">
            <h2 className="text-3xl font-bold text-center mb-8">3. Cole seu texto aqui</h2>
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
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">Grave ou envie um áudio com o estilo desejado ou com o modelo de referência.</p>

                    <div className="flex flex-wrap gap-2">
                       {!isRecording && (
                        <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                          <Mic className="mr-2 h-4 w-4" /> Gravar Áudio
                        </Button>
                      )}
                      {isRecording && (
                        <Button onClick={stopRecording} className="bg-gray-600 hover:bg-gray-700">
                          <Square className="mr-2 h-4 w-4" /> Parar Gravação
                        </Button>
                      )}
                      <Label htmlFor="audio-upload" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 cursor-pointer">
                        <FileAudio className="mr-2 h-4 w-4"/> Enviar Arquivo
                      </Label>
                      <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} className="hidden"/>
                    </div>
                    
                    {recordedAudioURL && (
                      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                        <p className="text-green-400 flex items-center mb-2">
                          <FileAudio className="mr-2 h-4 w-4" />
                          <span>{audioReferencia?.name} pronto para envio.</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <audio src={recordedAudioURL} controls className="w-full h-10" />
                          <Button onClick={deleteAudio} variant="destructive" size="icon">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
             </div>
          </section>

          <section>
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Orçamento Estimado</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-2">
                <p className="text-4xl font-bold text-green-400">
                  {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-sm text-gray-400">
                  {tipoGravacao === 'Produzida (voz + trilha + efeitos)' ? 'Gravação Produzida' : tipoGravacao === 'Off (somente voz)' ? 'Gravação Off (só a voz)' : 'Selecione o tipo de gravação'}
                </p>
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

    
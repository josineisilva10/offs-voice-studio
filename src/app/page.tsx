'use client';

import React, { useState, useMemo, ChangeEvent, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { PlayCircle, Send, FileAudio, Mic, Square, Trash2, StopCircle, Loader2 } from 'lucide-react';
import { useFirebase, useUser, initiateAnonymousSignIn, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// Dados dos locutores
const locutores = [
  { id: 1, nome: 'Silvia Fogaça', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1499&v=1' },
  { id: 2, nome: 'Charles Helfer', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1875&v=1' },
  { id: 3, nome: 'Denilson Soares', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=3199&v=1' },
  { id: 4, nome: 'Rogerio Britto', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=360&v=1' },
  { id: 5, nome: 'Jorge', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1948&v=1' },
  { id: 6, nome: 'Andre William', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=87&v=1' },
  { id: 7, nome: 'Jana Hanauer', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5793&v=1' },
  { id: 8, nome: 'Sara Luiza', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5720&v=1' },
  { id: 9, nome: 'JC', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=680&v=1' },
  { id: 10, nome: 'Pablo Siqueira', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=3358&v=1' },
  { id: 11, nome: 'Patricia Trezzi', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5061&v=1' },
  { id: 12, nome: 'Patricia Vieira', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1714&v=1' },
  { id: 13, nome: 'Donato De Paula', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5257&v=1' },
  { id: 14, nome: 'Jonas Moreira', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=2420&v=1' },
  { id: 15, nome: 'Elissandra Lima', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=570&v=1' },
  { id: 16, nome: 'Lula Muniz', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=222&v=1' },
  { id: 17, nome: 'Antonio Manoel', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=176&v=1' },
  { id: 18, nome: 'Anderson Henrique', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=183&v=1' },
  { id: 19, nome: 'Robson Ferreira', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=4568&v=1' },
  { id: 20, nome: 'Silva Jr', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=4223&v=1' },
  { id: 21, nome: 'Leandro Cruz', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=641&v=1' },
  { id: 22, nome: 'Duda Celino', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5738&v=1' },
  { id: 23, nome: 'Marcos Vinicius', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=3042&v=1' },
  { id: 24, nome: 'Leo Menezes', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=6193&v=1' },
  { id: 25, nome: 'Andre Gonzaga', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1183&v=1' },
  { id: 26, nome: 'Wisley', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=4982&v=1' },
  { id: 27, nome: 'Sunshine', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=64&v=1' },
  { id: 28, nome: 'Tito Maciel', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1125&v=1' },
  { id: 29, nome: 'Frank Barone', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=6185&v=1' },
  { id: 30, nome: 'Camargo Varejao', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5702&v=1' },
  { id: 31, nome: 'Diane', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=338&v=1' },
  { id: 32, nome: 'Hellen Reis', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5017&v=1' },
  { id: 33, nome: 'Josimai', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5758&v=1' },
  { id: 34, nome: 'Priscila Santos', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5159&v=1' },
  { id: 35, nome: 'Fernanda Petter', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1899&v=1' },
  { id: 36, nome: 'Bruninho Vox', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1&v=1' },
  { id: 37, nome: 'Washington Luis', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5864&v=1' },
  { id: 38, nome: 'Maximo', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1307&v=1' },
  { id: 39, nome: 'Emerson Costa', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=3423&v=1' },
  { id: 40, nome: 'Lindy', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=698&v=1' },
  { id: 41, nome: 'Alan Leandro', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=488&v=1' },
  { id: 42, nome: 'Brandão', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=1387&v=1' },
  { id: 43, nome: 'Bobby', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=5841&v=1' },
  { id: 44, nome: 'Absamira Santos', demoUrl: 'https://vozlocutor.com.br/download-audio.php?id=2052&v=1' },
  { id: 45, nome: 'Kavanhac', demoUrl: 'https://hd.paineldegravacao.com.br/demos/0713316001537166059.mp3' },
];

export default function Home() {
  const router = useRouter();
  const [textoCliente, setTextoCliente] = useState('');
  const [locutorSelecionado, setLocutorSelecionado] = useState<(typeof locutores[0]) | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [estiloGravacao, setEstiloGravacao] = useState('');
  const [estiloLocucao, setEstiloLocucao] = useState('');
  const [estiloLocucaoOutro, setEstiloLocucaoOutro] = useState('');
  const [tipoGravacao, setTipoGravacao] = useState('');
  const [instrucoesLocucao, setInstrucoesLocucao] = useState('');
  const [audioReferencia, setAudioReferencia] = useState<File | null>(null);
  const [trilhaSonora, setTrilhaSonora] = useState<File | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [vinheta1, setVinheta1] = useState('');
  const [vinheta2, setVinheta2] = useState('');
  const [vinheta3, setVinheta3] = useState('');

  const [valorTotal, setValorTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { auth, firestore, firebaseApp } = useFirebase();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const textoCompleto = useMemo(() => {
    if (estiloGravacao === 'Vinheta') {
      return [vinheta1, vinheta2, vinheta3].filter(Boolean).join(' ');
    }
    return textoCliente;
  }, [estiloGravacao, textoCliente, vinheta1, vinheta2, vinheta3]);

  const tempoEstimado = useMemo(() => {
    if (!textoCompleto.trim()) return 0;
    const palavras = textoCompleto.trim().split(/\s+/).length;
    const segundos = Math.ceil(palavras / 2.5);
    return segundos;
  }, [textoCompleto]);

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
    setValorTotal(parseFloat(valor.toFixed(2)));
  }, [tempoEstimado, tipoGravacao]);
  
  const handlePlay = (demoUrl: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    const newAudio = new Audio(demoUrl);
    audioRef.current = newAudio;
    newAudio.play().catch(error => console.error("Erro ao tocar o áudio:", error));
  };

  const handleStop = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
  };

  const handleSelecionar = (locutor: typeof locutores[0]) => {
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

  const handleTrilhaFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setTrilhaSonora(file);
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

  const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!firebaseApp) throw new Error("Firebase não foi inicializado.");
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };


  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    try {
        if (!user || !firestore) {
            throw new Error('Usuário ou Firestore não disponível.');
        }

        const newOrderRef = doc(collection(firestore, `users/${user.uid}/orders`));
        const orderId = newOrderRef.id;

        let audioReferenciaUrl = '';
        let trilhaSonoraUrl = '';

        if (audioReferencia) {
            audioReferenciaUrl = await uploadFile(audioReferencia, `referencias/${user.uid}/${orderId}/${audioReferencia.name}`);
        }
        if (trilhaSonora) {
            trilhaSonoraUrl = await uploadFile(trilhaSonora, `trilhas/${user.uid}/${orderId}/${trilhaSonora.name}`);
        }

        const estiloLocucaoFinal = estiloLocucao === 'Outros' ? `Outros: ${estiloLocucaoOutro}` : estiloLocucao;
        
        let textoCompletoParaDB = '';
        if (estiloGravacao === 'Vinheta') {
            textoCompletoParaDB = `Vinheta 1: ${vinheta1} | Vinheta 2: ${vinheta2} | Vinheta 3: ${vinheta3}`;
        } else {
            textoCompletoParaDB = textoCliente.trim();
        }

        const orderData = {
            id: orderId,
            userId: user.uid,
            orderDate: new Date().toISOString(),
            locutor: locutorSelecionado?.nome,
            estiloGravacao,
            estiloLocucao: estiloLocucaoFinal,
            tipoGravacao,
            texto: textoCompletoParaDB,
            tempoEstimado,
            totalAmount: valorTotal,
            instrucoes: instrucoesLocucao,
            audioReferenciaUrl: audioReferenciaUrl,
            trilhaSonoraUrl: trilhaSonoraUrl,
            status: 'pending' as 'pending' | 'completed',
        };
        
        await addDocumentNonBlocking(newOrderRef, orderData);

        router.push(`/checkout/${orderId}`);

    } catch (error) {
        console.error("Erro ao processar o pedido:", error);
        alert("Ocorreu um erro ao criar seu pedido. Por favor, tente novamente.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const isTextProvided = estiloGravacao === 'Vinheta' ? (vinheta1 || vinheta2 || vinheta3) : textoCliente;
  const isOrderReady = valorTotal > 0 && locutorSelecionado && isTextProvided && estiloGravacao && estiloLocucao && tipoGravacao;

  return (
    <div className="bg-[#F5F5F5] text-gray-800 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        
        <header className="text-center my-8 md:my-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1E3A8A]">
            Neyzinho das Produções
          </h1>
          <p className="text-lg text-gray-600 mt-2 font-light">
            Locuções profissionais com vozes de IA ou locutores reais.
          </p>
        </header>

        <main className="space-y-16">
        
          <section id="locutores-secao">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">1. Escolha um Locutor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locutores.map((locutor) => (
                <Card key={locutor.id} className={`bg-white border-border shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${locutorSelecionado?.id === locutor.id ? 'border-orange-500 ring-2 ring-orange-500' : 'hover:shadow-xl'}`}>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#1E3A8A]">{locutor.nome}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                       <div className="flex-1 flex gap-2">
                         <Button onClick={() => handlePlay(locutor.demoUrl)} variant="outline" className="flex-1 border-primary text-primary">
                           <PlayCircle className="mr-2 h-4 w-4" /> 
                           Play
                         </Button>
                         <Button onClick={handleStop} variant="destructive" className="flex-1">
                           <StopCircle className="mr-2 h-4 w-4" /> 
                           Stop
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button onClick={() => handleSelecionar(locutor)} className="w-full bg-[#EA580C] hover:bg-orange-600 text-white font-bold">
                        Selecionar {locutor.nome.split(' ')[0]}
                      </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section id="detalhes-secao">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">2. Detalhes da Gravação</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-border shadow-lg rounded-xl">
                <CardHeader><CardTitle className="text-lg text-[#1E3A8A]">Estilo de Gravação</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={estiloGravacao} onValueChange={setEstiloGravacao} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Gravação Comercial" id="rg-comercial" /><Label htmlFor="rg-comercial">Comercial</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Vinheta" id="rg-vinheta" /><Label htmlFor="rg-vinheta">Vinheta</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Chamada de Festa" id="rg-festa" /><Label htmlFor="rg-festa">Chamada de Festa</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Spot" id="rg-spot" /><Label htmlFor="rg-spot">Spot</Label></div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-white border-border shadow-lg rounded-xl">
                <CardHeader><CardTitle className="text-lg text-[#1E3A8A]">Estilo de Locução</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={estiloLocucao} onValueChange={setEstiloLocucao} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Padrão" id="rl-padrao" /><Label htmlFor="rl-padrao">Padrão</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Impacto" id="rl-impacto" /><Label htmlFor="rl-impacto">Impacto</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Animado" id="rl-animado" /><Label htmlFor="rl-animado">Animado</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Varejo" id="rl-varejo" /><Label htmlFor="rl-varejo">Varejo</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Jovem" id="rl-jovem" /><Label htmlFor="rl-jovem">Jovem</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Caricata" id="rl-caricata" /><Label htmlFor="rl-caricata">Caricata</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Outros" id="rl-outros" /><Label htmlFor="rl-outros">Outros</Label></div>
                  </RadioGroup>
                  {estiloLocucao === 'Outros' && (
                    <Input type="text" placeholder="Descreva o estilo" value={estiloLocucaoOutro} onChange={(e) => setEstiloLocucaoOutro(e.target.value)} className="mt-4"/>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-border shadow-lg rounded-xl">
                <CardHeader><CardTitle className="text-lg text-[#1E3A8A]">Tipo da Gravação</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={tipoGravacao} onValueChange={setTipoGravacao} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Off (somente voz)" id="tipo-off" /><Label htmlFor="tipo-off">Off (somente voz)</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Produzida (voz + trilha + efeitos)" id="tipo-produzida" /><Label htmlFor="tipo-produzida">Produzida (com trilha e efeitos)</Label></div>
                  </RadioGroup>
                  {tipoGravacao === 'Produzida (voz + trilha + efeitos)' && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Label htmlFor="trilha-upload" className="font-semibold text-gray-700">Trilha Sonora (Opcional)</Label>
                      <p className="text-gray-500 text-sm mb-2">Envie o arquivo de áudio da trilha.</p>
                      <Input 
                        id="trilha-upload" 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleTrilhaFileChange} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                      />
                       {trilhaSonora && (
                        <div className="mt-2 text-green-600 text-xs flex items-center">
                          <FileAudio className="mr-2 h-3 w-3" />
                          <span>{trilhaSonora.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="texto-cliente-secao">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">3. Insira seu Texto</h2>
             <Card className="bg-white border-border shadow-lg rounded-xl p-6">
                {estiloGravacao === 'Vinheta' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor='vinheta1' className="text-lg font-semibold mb-2 block text-gray-700">Vinheta 1</Label>
                      <Input id="vinheta1" placeholder="Digite o texto para a vinheta 1" value={vinheta1} onChange={(e) => setVinheta1(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor='vinheta2' className="text-lg font-semibold mb-2 block text-gray-700">Vinheta 2</Label>
                      <Input id="vinheta2" placeholder="Digite o texto para a vinheta 2" value={vinheta2} onChange={(e) => setVinheta2(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor='vinheta3' className="text-lg font-semibold mb-2 block text-gray-700">Vinheta 3</Label>
                      <Input id="vinheta3" placeholder="Digite o texto para a vinheta 3" value={vinheta3} onChange={(e) => setVinheta3(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor='texto-principal' className="text-lg font-semibold mb-2 block text-gray-700">Texto para Gravação</Label>
                    <Textarea
                      id="texto-principal"
                      className="w-full min-h-[200px]"
                      placeholder="Digite ou cole aqui o roteiro da sua locução..."
                      value={textoCliente}
                      onChange={(e) => setTextoCliente(e.target.value)}
                    />
                  </div>
                )}
                <div className="text-center mt-4 text-lg text-gray-700">
                  <span className="font-semibold">Tempo estimado:</span> {tempoEstimado} segundos
                </div>
            </Card>
          </section>
          
          <section>
             <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">4. Instruções e Referências</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-border shadow-lg rounded-xl">
                  <CardHeader><CardTitle className="text-lg text-[#1E3A8A]">Instruções de Locução</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Descreva o ritmo, velocidade, energia, referências e outros detalhes importantes."
                      className="w-full min-h-[150px]"
                      value={instrucoesLocucao}
                      onChange={(e) => setInstrucoesLocucao(e.target.value)}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-white border-border shadow-lg rounded-xl">
                  <CardHeader><CardTitle className="text-lg text-[#1E3A8A]">Áudio de Referência (Opcional)</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-500 text-sm">Grave ou envie um áudio com o estilo desejado.</p>

                    <div className="flex flex-wrap gap-2">
                       {!isRecording && (
                        <Button onClick={startRecording} variant="destructive">
                          <Mic className="mr-2 h-4 w-4" /> Gravar Áudio
                        </Button>
                      )}
                      {isRecording && (
                        <Button onClick={stopRecording} variant="secondary">
                          <Square className="mr-2 h-4 w-4" /> Parar Gravação
                        </Button>
                      )}
                      <Label htmlFor="audio-upload" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#1E3A8A] text-white hover:bg-blue-800 h-10 px-4 py-2 cursor-pointer">
                        <FileAudio className="mr-2 h-4 w-4"/> Enviar Arquivo
                      </Label>
                      <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} className="hidden"/>
                    </div>
                    
                    {recordedAudioURL && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="text-green-600 flex items-center mb-2 font-semibold">
                          <FileAudio className="mr-2 h-4 w-4" />
                          <span>{audioReferencia?.name} pronto.</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <audio src={recordedAudioURL} controls className="w-full h-10" />
                          <Button onClick={deleteAudio} variant="ghost" size="icon">
                             <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
             </div>
          </section>

          <section id="pagamento-secao">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">5. Orçamento e Pagamento</h2>
            <Card className="bg-white border-border shadow-xl rounded-xl text-center max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1E3A8A]">Orçamento Final</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-2">
                <p className="text-5xl font-bold text-green-600">
                  {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-sm text-gray-500">
                  {tipoGravacao ? tipoGravacao : 'Selecione o tipo de gravação para ver o preço'}
                </p>
              </CardContent>
              <CardFooter className="flex-col gap-4 p-6">
                <Button 
                  size="lg" 
                  onClick={handleProceedToPayment} 
                  className="w-full bg-[#EA580C] hover:bg-orange-600 text-white text-lg px-8 py-6" 
                  disabled={isUserLoading || !isOrderReady || isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
                  ) : (
                    <><Send className="mr-3 h-5 w-5" /> Ir para o Pagamento</>
                  )}
                </Button>
                 <p className="text-xs text-gray-400">Você será redirecionado para a página de pagamento seguro.</p>
              </CardFooter>
            </Card>
          </section>

          <section id="tabela-precos-secao" className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1E3A8A]">Tabela de Preços</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border-border shadow-lg rounded-xl text-center">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1E3A8A]">Locução OFF</CardTitle>
                  <p className="text-sm text-gray-500">(somente a voz)</p>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">R$ 7,00</p>
                  <p className="text-sm text-gray-500">para textos de até 40 segundos.</p>
                  <p className="text-xs text-gray-400 mt-1">+ R$0,20 por segundo adicional</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border shadow-lg rounded-xl text-center">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1E3A8A]">Locução Produzida</CardTitle>
                  <p className="text-sm text-gray-500">(voz + trilha + efeitos)</p>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">R$ 15,00</p>
                  <p className="text-sm text-gray-500">para textos de até 40 segundos.</p>
                   <p className="text-xs text-gray-400 mt-1">+ R$0,35 por segundo adicional</p>
                </CardContent>
              </Card>
            </div>
          </section>

        </main>

        <footer className="text-center mt-16 py-8 border-t border-border">
          <p className="font-bold text-lg text-[#1E3A8A]">Neyzinho das Produções</p>
          <p className="text-sm text-gray-500">Qualidade e rapidez para sua locução profissional.</p>
          <div className="flex justify-center gap-4 mt-4">
             <Link href="/historico" className="text-blue-700 hover:text-orange-500">Meus Pedidos</Link>
             <Link href="/admin" className="text-blue-700 hover:text-orange-500">Admin</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

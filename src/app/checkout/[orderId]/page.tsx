'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { generatePayment, GeneratePaymentOutput } from '@/ai/flows/payment-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Order {
  id: string;
  userId: string;
  orderDate: string;
  locutor: string;
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  customerCpf?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { firestore } = useFirebase();
  const { user } = useUser();

  const [paymentInfo, setPaymentInfo] = useState<GeneratePaymentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', cpf: '' });
  const [isCustomerInfoSet, setIsCustomerInfoSet] = useState(false);

  // A referência agora aponta para a coleção global 'orders'
  const orderRef = useMemoFirebase(() => {
    if (!firestore || !orderId) return null;
    return doc(firestore, `orders/${orderId}`);
  }, [firestore, orderId]);

  const { data: orderData, isLoading: isOrderLoading, error: orderError } = useDoc<Order>(orderRef);
  
  // Efeito para verificar se o usuário logado é o dono do pedido
  useEffect(() => {
    if (orderData && user && orderData.userId !== user.uid) {
        setError('Acesso negado. Este pedido não pertence a você.');
    }
  },[orderData, user]);


  const handleGeneratePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData || !user || orderData.userId !== user.uid) {
        setError('Não foi possível verificar o pedido. Tente novamente.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateDoc(orderRef!, {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerCpf: customerInfo.cpf,
      });

      const paymentInput = {
        amount: Math.round(orderData.totalAmount * 100), // Convert to cents
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          cpf: customerInfo.cpf,
        },
        description: `Pedido de locução para ${orderData.locutor}`,
        orderId: orderData.id,
      };

      const result = await generatePayment(paymentInput);
      setPaymentInfo(result);
      
      await updateDoc(orderRef!, { chargeId: result.chargeId });
      setIsCustomerInfoSet(true);

    } catch (err: any) {
      console.error(err);
      setError('Falha ao gerar o pagamento. Verifique os dados e tente novamente.');
      // router.push('/error?message=' + encodeURIComponent(err.message || 'Erro desconhecido.'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (paymentInfo) {
      navigator.clipboard.writeText(paymentInfo.qrCodeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fullError = orderError ? orderError.message : (error || null);
    if(fullError){
        setError(fullError);
        setIsLoading(false);
        return;
    }
    if (!isOrderLoading && !orderData) {
       setError('Pedido não encontrado.');
       setIsLoading(false);
    } else if (orderData) {
        if (orderData.customerName && orderData.customerEmail && orderData.customerCpf) {
            const info = {
                name: orderData.customerName,
                email: orderData.customerEmail,
                cpf: orderData.customerCpf,
            };
            setCustomerInfo(info);
            // Auto-trigger payment generation if we have the data and it hasn't been generated yet
            if (!paymentInfo) {
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                handleGeneratePayment(fakeEvent);
            }
        } else {
            setIsLoading(false);
        }
    }
  }, [orderData, isOrderLoading, orderError, error]);


  if (isLoading || isOrderLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5]">
        <Loader2 className="h-12 w-12 animate-spin text-[#1E3A8A]" />
        <p className="mt-4 text-gray-600">Carregando checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <h1 className="text-2xl font-bold text-red-600">Erro no Checkout</h1>
        <p className="mt-2 text-gray-600 text-center max-w-md">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-4 bg-blue-600 hover:bg-blue-700">Voltar para o início</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5] p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1E3A8A]">Finalizar Pagamento</CardTitle>
          <CardDescription className="text-gray-500">
            {orderData?.locutor} - Pedido #{orderId.substring(0, 6)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCustomerInfoSet || !paymentInfo ? (
             <form onSubmit={handleGeneratePayment} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input type="text" id="name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1E3A8A] focus:border-[#1E3A8A] sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1E3A8A] focus:border-[#1E3A8A] sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                    <input type="text" id="cpf" value={customerInfo.cpf} onChange={e => setCustomerInfo({...customerInfo, cpf: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1E3A8A] focus:border-[#1E3A8A] sm:text-sm" />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-600 text-white font-bold py-3">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Gerar QR Code PIX'}
                </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Pague com PIX para confirmar</h3>
              <div className="flex justify-center">
                <Image src={paymentInfo.qrCodeUrl} alt="PIX QR Code" width={256} height={256} className="rounded-lg shadow-md" />
              </div>
              <p className="text-lg font-bold text-green-600">
                Total: {orderData?.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <div className="p-3 bg-gray-100 rounded-lg">
                <label className="text-sm text-gray-500">Ou use o PIX Copia e Cola:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="text" readOnly value={paymentInfo.qrCodeText} className="w-full bg-gray-200 border-none rounded text-xs p-2" />
                  <Button onClick={copyToClipboard} size="icon" variant="ghost">
                    {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-500" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Após o pagamento, o status do seu pedido será atualizado automaticamente. Você receberá a gravação no seu email.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
           <Button variant="link" onClick={() => router.push('/')} className="w-full text-gray-500">Cancelar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

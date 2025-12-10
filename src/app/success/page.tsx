'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5] p-4">
      <Card className="w-full max-w-md text-center bg-white shadow-xl rounded-2xl">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-gray-900">Pagamento Confirmado!</CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Seu pedido de locução foi recebido e já está em produção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Você receberá a gravação finalizada no seu email assim que estiver pronta. 
            Obrigado por escolher a VozGenius!
          </p>
          <div className="mt-6">
            <Link href="/historico">
              <Button className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white">
                Ver Histórico de Pedidos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

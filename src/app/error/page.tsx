'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Ocorreu um problema inesperado.';

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5] p-4">
      <Card className="w-full max-w-md text-center bg-white shadow-xl rounded-2xl">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-gray-900">Falha na Operação</CardTitle>
          <CardDescription className="mt-2 text-red-600">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Pedimos desculpas pelo inconveniente. Por favor, tente novamente. Se o problema persistir, entre em contato com nosso suporte.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white">
                Voltar para a Página Inicial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

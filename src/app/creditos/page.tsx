
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';

const officePackages = [
  {
    title: 'Pacote 1 Crédito',
    price: '6,00',
    credits: 1,
    description: 'Ideal para uma gravação rápida e pontual.',
    pricePerCredit: null,
    features: ['Texto de até 40 segundos'],
  },
  {
    title: 'Pacote 5 Créditos',
    price: '25,00',
    credits: 5,
    description: 'Economize R$ 5! O crédito sai a R$ 5,00.',
    pricePerCredit: 5,
    features: ['5 textos de até 40 segundos cada'],
    popular: true,
  },
  {
    title: 'Pacote 10 Créditos',
    price: '40,00',
    credits: 10,
    description: 'Melhor custo-benefício! O crédito sai a R$ 4,00.',
    pricePerCredit: 4,
    features: ['10 textos de até 40 segundos cada'],
  },
];

const producedPackages = [
    {
    title: '1 Crédito Produzido',
    price: '15,00',
    credits: 1,
    description: 'Para uma produção de alto impacto.',
    pricePerCredit: null,
    features: ['Texto de até 40s com produção'],
  },
  {
    title: '5 Créditos Produzidos',
    price: '65,00',
    credits: 5,
    description: 'Ótimo valor. O crédito sai a R$ 13,00.',
    pricePerCredit: 13,
    features: ['5 textos de até 40s com produção'],
    popular: true,
  },
  {
    title: '10 Créditos Produzidos',
    price: '120,00',
    credits: 10,
    description: 'Máxima economia. O crédito sai a R$ 12,00.',
    pricePerCredit: 12,
    features: ['10 textos de até 40s com produção'],
  },
]

export default function CreditosPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Créditos e Pacotes</h1>
          <p className="text-muted-foreground">
            Escolha o pacote ideal para suas necessidades e comece a gravar.
          </p>
        </div>

        <Tabs defaultValue="office" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="office">Pacotes Office (Off / Básico)</TabsTrigger>
            <TabsTrigger value="produced">Gravação Produzida (Premium)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="office" className="mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officePackages.map((pkg) => (
                    <Card key={pkg.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{pkg.title}</CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                             <div className="flex items-baseline">
                                <span className="text-4xl font-bold">R${pkg.price}</span>
                             </div>
                             <ul className="space-y-2 text-sm text-muted-foreground">
                                {pkg.features.map(feat => (
                                    <li key={feat} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Créditos não expiram</span>
                                </li>
                             </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Comprar Pacote</Button>
                        </CardFooter>
                    </Card>
                ))}
             </div>
          </TabsContent>
          
          <TabsContent value="produced" className="mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {producedPackages.map((pkg) => (
                    <Card key={pkg.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{pkg.title}</CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                             <div className="flex items-baseline">
                                <span className="text-4xl font-bold">R${pkg.price}</span>
                             </div>
                             <ul className="space-y-2 text-sm text-muted-foreground">
                                {pkg.features.map(feat => (
                                    <li key={feat} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                                 <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Créditos não expiram</span>
                                </li>
                             </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Comprar Pacote</Button>
                        </CardFooter>
                    </Card>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

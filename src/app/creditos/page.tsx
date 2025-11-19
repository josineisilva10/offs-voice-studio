import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { creditPackages } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function CreditosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Créditos e Pacotes"
        description="Escolha o pacote de créditos ideal para suas necessidades e comece a gerar vozes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creditPackages.map((pkg) => (
          <Card key={pkg.id} className={cn("flex flex-col", pkg.popular && "border-primary ring-2 ring-primary")}>
            {pkg.popular && (
              <div className="py-1 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg">
                Mais Popular
              </div>
            )}
            <CardHeader className="items-center text-center">
              <CardTitle className="font-headline text-2xl">{pkg.credits} Créditos</CardTitle>
              {pkg.bonus && (
                <CardDescription className="font-semibold text-accent">{pkg.bonus}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <div className="text-4xl font-bold font-headline mb-4">
                R$ {pkg.price.toFixed(2).replace('.', ',')}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 justify-center"><Check className="size-4 text-green-500" /> Acesso a todas as vozes</li>
                <li className="flex items-center gap-2 justify-center"><Check className="size-4 text-green-500" /> Qualidade HD</li>
                <li className="flex items-center gap-2 justify-center"><Check className="size-4 text-green-500" /> Suporte prioritário</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={pkg.popular ? "default" : "secondary"}>
                Comprar Agora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { offsPackages, producedPackages, type CreditPackage } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

function PackageCard({ pkg }: { pkg: CreditPackage }) {
  const pricePerCredit = pkg.credits > 0 ? pkg.price / pkg.credits : 0;

  return (
    <Card className={cn("flex flex-col", pkg.popular && "border-primary ring-2 ring-primary")}>
      {pkg.popular && (
        <div className="py-1 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg">
          Mais Popular
        </div>
      )}
      <CardHeader className="items-center text-center">
        <CardTitle className="font-headline text-2xl">{pkg.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <div className="mb-4">
            <div className="text-4xl font-bold font-headline">
            R$ {pkg.price.toFixed(2).replace('.', ',')}
            </div>
            {pkg.credits > 1 && (
                 <p className="text-sm text-muted-foreground">
                    (R$ {pricePerCredit.toFixed(2).replace('.', ',')} por crédito)
                 </p>
            )}
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 justify-center">
              <Check className="size-4 text-green-500" /> {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={pkg.popular ? "default" : "secondary"}>
          Comprar Agora
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CreditosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Créditos e Pacotes"
        description="Escolha o pacote de créditos ideal para suas necessidades e comece a gerar vozes."
      />

      <Tabs defaultValue="offs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="offs">Pacotes Offs</TabsTrigger>
          <TabsTrigger value="produced">Gravação Produzida</TabsTrigger>
        </TabsList>
        <TabsContent value="offs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {offsPackages.map((pkg) => (
              <PackageCard key={`off-${pkg.id}`} pkg={pkg} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="produced">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {producedPackages.map((pkg) => (
              <PackageCard key={`prod-${pkg.id}`} pkg={pkg} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

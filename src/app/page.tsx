import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Zap, Users, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background shadow-sm">
        <Link href="/" className="flex items-center justify-center">
          <Mic className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold font-headline">VozGenius</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Entrar
          </Link>
          <Button asChild>
            <Link href="/signup">Cadastre-se</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary font-headline">
                    Sua voz, sua marca. Gravações profissionais em minutos.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Peça sua locução agora. Escolha entre dezenas de locutores profissionais e vozes de IA para dar vida ao seu projeto.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                     <Link href="/signup">
                        Peça sua locução agora
                     </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <Mic className="h-48 w-48 text-primary/20" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nossos Recursos</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Como funciona</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Três passos simples para transformar seu texto em uma locução de alta qualidade.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary text-primary-foreground mb-4">
                        <Zap className="h-8 w-8" />
                    </div>
                  <CardTitle>1. Crie seu texto</CardTitle>
                  <CardDescription>Use nosso gerador de texto com IA ou escreva seu próprio roteiro.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary text-primary-foreground mb-4">
                        <Users className="h-8 w-8" />
                    </div>
                  <CardTitle>2. Escolha a Voz</CardTitle>
                  <CardDescription>Navegue por um marketplace de locutores reais e vozes de IA.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary text-primary-foreground mb-4">
                        <PlayCircle className="h-8 w-8" />
                    </div>
                  <CardTitle>3. Gere a Gravação</CardTitle>
                  <CardDescription>Envie seu pedido e receba o áudio profissional em minutos ou horas.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 VozGenius. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

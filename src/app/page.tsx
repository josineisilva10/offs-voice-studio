import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Bem-vindo ao seu novo projeto!
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Seu projeto foi limpo e está pronto para um novo começo.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <p className="text-sm text-muted-foreground">
            Edite <code>src/app/page.tsx</code> para começar.
          </p>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Olá, Mundo!</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Seu projeto foi reiniciado.
        </p>
      </div>
    </main>
  );
}

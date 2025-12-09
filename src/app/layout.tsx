
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neyzinho das Produções",
  description: "Locuções profissionais para comerciais, DJs, vinhetas e muito mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SVG de ruído encodado para ser usado no CSS. É uma técnica leve e performática.
  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  
  const backgroundStyle: React.CSSProperties = {
    // Camada 1: O gradiente radial que já tínhamos
    backgroundImage: `radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(224, 71%, 2%)), ${noiseSvg}`,
    // Camada 2: O filtro de ruído sutil por cima
    backgroundRepeat: 'repeat, repeat',
    backgroundSize: 'auto, 256px',
    backgroundPosition: 'center, center',
    opacity: 1, // Opacidade total para o body
    // O ruído será sutil por causa da sua própria opacidade e da forma como se mescla.
  };

  return (
    <html lang="pt-BR">
      <body 
        className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} 
        style={backgroundStyle}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'hsla(var(--background), 0.7)', // Uma sobreposição de cor para garantir a legibilidade do texto
          zIndex: -1
        }}></div>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

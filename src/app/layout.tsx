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
  return (
    <html lang="pt-BR">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} style={{ background: 'radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(224, 71%, 2%))' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

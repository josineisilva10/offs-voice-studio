import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FirebaseClientProvider } from "@/firebase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VozGenius",
  description: "Marketplace de locuções",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

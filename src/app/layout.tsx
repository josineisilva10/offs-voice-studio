import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: '--font-poppins',
});
const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: "VozGenius",
  description: "Gere locuções profissionais com vozes de IA ou locutores reais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR" className="h-full">
      <body 
        className={cn(
          "h-full bg-[#F5F5F5] font-sans antialiased",
           poppins.variable, 
           ptSans.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

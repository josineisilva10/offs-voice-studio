import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: '--font-poppins',
});
const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: "Off Voice Studio",
  description: "Gere locuções profissionais.",
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-611847233-7c1f1.firebasestorage.app/o/Gemini_Generated_Image_qsh9ukqsh9ukqsh9.png?alt=media&token=2053afc2-21dd-4804-afa5-87eb5daa995d',
  },
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
          "h-full bg-background font-sans antialiased",
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

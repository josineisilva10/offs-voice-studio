import type { Metadata } from 'next';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserProfile } from '@/components/user-profile';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/auth-guard';


export const metadata: Metadata = {
  title: 'OffsVoiceStudio',
  description: 'Sua plataforma de gravação e geração de voz com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthGuard>
            <SidebarProvider>
              <Sidebar
                variant="sidebar"
                collapsible="icon"
                className="border-sidebar-border"
              >
                <SidebarHeader>
                  <Logo />
                </SidebarHeader>
                <SidebarContent>
                  <MainNav />
                </SidebarContent>
                <SidebarFooter className="p-4">
                  <UserProfile />
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
                  <SidebarTrigger />
                  <Logo className="md:hidden" />
                </header>
                <main className="flex-1 p-4 sm:p-6">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </AuthGuard>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

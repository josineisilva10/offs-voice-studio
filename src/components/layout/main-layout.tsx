
"use client";

import Link from "next/link";
import {
  Bell,
  CircleUser,
  CreditCard,
  Home,
  Menu,
  Mic,
  Package2,
  ScrollText,
  Search,
  Users,
  BotMessageSquare,
  Cog,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { AuthGuard } from "../auth/auth-guard";

const navLinks = [
    { href: "/dashboard", label: "Painel Principal", icon: Home },
    { href: "/gravacao", label: "Gravação de voz", icon: Mic },
    { href: "/pedidos", label: "Meus Pedidos", icon: ScrollText },
    { href: "/vozes", label: "Lista de Vozes", icon: Users },
    { href: "/gerador-ia", label: "Gerador de texto com IA", icon: BotMessageSquare },
    { href: "/creditos", label: "Crédito e pacote", icon: CreditCard },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const isAdmin = user?.email === 'JosineiSilva2.com';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === link.href && "bg-muted text-primary",
            isMobile && "text-lg"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin/locutores"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
             pathname.startsWith('/admin') && "bg-muted text-primary",
             isMobile && "text-lg"
          )}
        >
          <Cog className="h-4 w-4" />
          Gerenciamento de locutores
        </Link>
      )}
    </>
  );

  return (
     <AuthGuard>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Mic className="h-6 w-6 text-primary" />
                <span className="font-headline">VozGenius</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {renderNavLinks()}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Seu Saldo</CardTitle>
                  <CardDescription>
                    Você tem <strong>0 créditos</strong> disponíveis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/creditos">
                      Comprar Créditos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-4 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Mic className="h-6 w-6 text-primary" />
                    <span className="font-headline">VozGenius</span>
                  </Link>
                  {renderNavLinks(true)}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
              {/* You can add a search bar here if needed in the future */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email || "Minha Conta"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Pedidos</DropdownMenuItem>
                <DropdownMenuItem>Créditos</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
            <div className="inline-flex items-center justify-center">
                <Mic className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold font-headline">Crie sua conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para começar a usar o VozGenius.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Nome</Label>
              <Input id="first-name" placeholder="João" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Sobrenome</Label>
              <Input id="last-name" placeholder="Silva" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nome do WhatsApp</Label>
            <Input id="whatsapp" placeholder="Ex: João Silva Vendas" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required />
            <p className="text-xs text-muted-foreground">A senha deve ter no mínimo 8 caracteres.</p>
          </div>
          <Button type="submit" className="w-full">
            Criar conta
          </Button>
        </CardContent>
        <CardContent className="mt-0 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline ml-1">
            Entrar
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

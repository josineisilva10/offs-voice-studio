import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
            <div className="inline-flex items-center justify-center">
                <Mic className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold font-headline">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar seu painel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/signup" className="underline ml-1">
            Criar conta
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

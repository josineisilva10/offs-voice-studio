"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { signInWithEmail } from "@/firebase/auth/auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signInWithEmail(auth, values.email, values.password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      // Aqui você pode usar um toast para mostrar o erro
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-flex items-center justify-center">
            <Mic className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">
            Bem-vindo de volta!
          </CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar seu painel.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </CardContent>
          </form>
        </Form>
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

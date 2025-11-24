"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useAuth, useFirestore } from "@/firebase";
import { signUpWithEmail } from "@/firebase/auth/auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "O nome é obrigatório." }),
  lastName: z.string().min(1, { message: "O sobrenome é obrigatório." }),
  whatsappName: z.string().min(1, { message: "O nome do WhatsApp é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsappName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signUpWithEmail(
        auth,
        firestore,
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.whatsappName
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no cadastro:", error);
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
            Crie sua conta
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para começar a usar o VozGenius.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="whatsappName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva Vendas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </CardContent>
          </form>
        </Form>
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

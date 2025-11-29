"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUser } from "@/firebase/auth/auth";
import { AuthError } from "firebase/auth";
import { Mic } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(1, "O nome é obrigatório."),
  lastName: z.string().min(1, "O sobrenome é obrigatório."),
  whatsAppName: z.string().min(1, "O nome do WhatsApp é obrigatório."),
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (data: SignupFormValues) => {
    setFirebaseError(null);
    try {
      await createUser(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        whatsAppNumber: data.whatsAppName,
      });
      router.push("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === "auth/email-already-in-use") {
        setFirebaseError("Este email já está em uso.");
      } else {
        setFirebaseError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
    }
  };
  
    if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                 <Mic className="h-10 w-10 text-indigo-400" />
                 <h1 className="ml-2 text-3xl font-bold">VozGenius</h1>
            </div>
          <CardTitle>Criar uma conta</CardTitle>
          <CardDescription>
            Junte-se à plataforma para começar a gerar suas locuções.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsAppName">Nome do WhatsApp</Label>
              <Input id="whatsAppName" {...register("whatsAppName")} />
              {errors.whatsAppName && (
                <p className="text-xs text-red-500">
                  {errors.whatsAppName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {firebaseError && (
              <p className="text-sm text-red-500 text-center">{firebaseError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

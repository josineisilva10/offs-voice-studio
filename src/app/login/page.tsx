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
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha não pode estar em branco." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setFirebaseError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setFirebaseError("Email ou senha inválidos.");
          break;
        default:
          setFirebaseError("Ocorreu um erro ao fazer login. Tente novamente.");
          break;
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
          <CardTitle>Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Faça login para acessar seu painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="********"
              />
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
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/signup" className="underline">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

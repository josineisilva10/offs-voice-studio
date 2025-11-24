import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">Painel Principal</h1>
        <p className="text-muted-foreground">
            Bem-vindo ao seu painel! Aqui você tem acesso rápido a todas as funcionalidades.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>Créditos</CardTitle>
                    <CardDescription>0</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pedidos Realizados</CardTitle>
                    <CardDescription>0</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Vozes Favoritas</CardTitle>
                    <CardDescription>0</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>0</CardDescription>
                </CardHeader>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Painel Principal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao VozGenius!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore as funcionalidades no menu ao lado.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

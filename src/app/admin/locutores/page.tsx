
import { PageHeader } from '@/components/page-header';
import { LocutoresAdminList } from './locutores-admin-list';

export default function AdminLocutoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gerenciamento de Locutores"
        description="Adicione, edite e gerencie os locutores da sua plataforma."
      />
      <LocutoresAdminList />
    </div>
  );
}

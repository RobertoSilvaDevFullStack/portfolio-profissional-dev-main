import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const ManageContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Gerenciar Conteúdo</h1>

      <Alert className="bg-blue-900/20 border-blue-500">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Funcionalidade em Desenvolvimento</AlertTitle>
        <AlertDescription>
          Esta página está sendo migrada para a nova API backend.
          <br /><br />
          <strong>Status:</strong> A tabela de conteúdo do site ainda não foi criada no novo banco de dados.
          <br /><br />
          <strong>Próximos passos:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Criar modelo SiteContent no Prisma schema</li>
            <li>Criar endpoint /api/content no backend</li>
            <li>Migrar esta página para usar a nova API</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ManageContent;

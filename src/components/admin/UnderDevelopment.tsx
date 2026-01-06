import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface UnderDevelopmentProps {
    title: string;
    featureName: string;
    nextSteps?: string[];
}

export const UnderDevelopment = ({ title, featureName, nextSteps }: UnderDevelopmentProps) => {
    const defaultSteps = [
        `Criar modelo ${featureName} no Prisma schema`,
        `Criar endpoint /api/${featureName.toLowerCase()} no backend`,
        `Migrar esta página para usar a nova API`,
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

            <Alert className="bg-blue-900/20 border-blue-500">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Funcionalidade em Desenvolvimento</AlertTitle>
                <AlertDescription>
                    Esta página está sendo migrada para a nova API backend.
                    <br /><br />
                    <strong>Status:</strong> Migração em andamento.
                    <br /><br />
                    <strong>Próximos passos:</strong>
                    <ul className="list-disc list-inside mt-2">
                        {(nextSteps || defaultSteps).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
};

import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GooglePreviewProps {
  title: string;
  description: string;
  slug: string;
  domain?: string;
}

const GooglePreview = ({
  title,
  description,
  slug,
  domain = "seusite.com",
}: GooglePreviewProps) => {
  // Truncar título para 60 caracteres
  const truncatedTitle =
    title.length > 60 ? title.substring(0, 60) + "..." : title;

  // Truncar descrição para 160 caracteres
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 160) + "..."
      : description;

  // Criar URL completa
  const fullUrl = `https://${domain}/blog/${slug}`;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5" />
          Preview do Google
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Google SERP Preview */}
        <div className="bg-white p-4 rounded-lg">
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-1 mb-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <Globe className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700 font-medium">
                {domain}
              </span>
              <span className="text-xs text-gray-600 truncate max-w-md">
                {fullUrl}
              </span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-1 line-clamp-1">
            {truncatedTitle || "Seu título aparecerá aqui"}
          </h3>

          {/* Descrição */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {truncatedDescription ||
              "Sua meta descrição aparecerá aqui. Adicione uma descrição atraente para melhorar a taxa de cliques."}
          </p>

          {/* Data (exemplo) */}
          <div className="mt-2 text-xs text-gray-500">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Contador de caracteres */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400 mb-1">Título</div>
            <div
              className={`font-medium ${
                title.length === 0
                  ? "text-red-400"
                  : title.length < 30
                  ? "text-yellow-400"
                  : title.length > 60
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {title.length}/60 caracteres
            </div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400 mb-1">Descrição</div>
            <div
              className={`font-medium ${
                description.length === 0
                  ? "text-red-400"
                  : description.length < 120
                  ? "text-yellow-400"
                  : description.length > 160
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {description.length}/160 caracteres
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GooglePreview;

import { Share2, Facebook, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SocialPreviewProps {
  title: string;
  description: string;
  imageUrl?: string;
  domain?: string;
}

const SocialPreview = ({ 
  title, 
  description, 
  imageUrl,
  domain = 'seusite.com'
}: SocialPreviewProps) => {
  // Truncar título para redes sociais (geralmente 70 caracteres)
  const truncatedTitle = title.length > 70 
    ? title.substring(0, 70) + '...' 
    : title;

  // Truncar descrição para redes sociais (geralmente 200 caracteres)
  const truncatedDescription = description.length > 200 
    ? description.substring(0, 200) + '...' 
    : description;

  const placeholderImage = 'https://placehold.co/1200x630/1f2937/e5e7eb?text=Imagem+de+Capa';

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Share2 className="h-5 w-5" />
          Preview de Redes Sociais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="facebook" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="facebook" className="data-[state=active]:bg-gray-600">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="data-[state=active]:bg-gray-600">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Facebook Preview */}
          <TabsContent value="facebook" className="mt-4">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
              {/* Post Header */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Sua Página</div>
                    <div className="text-xs text-gray-500">Agora · 🌐</div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-900">
                  Confira nosso novo post! 🚀
                </p>
              </div>

              {/* Link Preview Card */}
              <div className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="relative w-full" style={{ paddingBottom: '52.5%' }}>
                  <img 
                    src={imageUrl || placeholderImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-xs text-gray-500 uppercase mb-1">{domain}</div>
                  <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                    {truncatedTitle || 'Seu título aparecerá aqui'}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncatedDescription || 'Sua descrição aparecerá aqui'}
                  </p>
                </div>
              </div>

              {/* Interactions */}
              <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 hover:underline">
                    👍 Curtir
                  </button>
                  <button className="flex items-center gap-1 hover:underline">
                    💬 Comentar
                  </button>
                  <button className="flex items-center gap-1 hover:underline">
                    ↗️ Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Preview */}
          <TabsContent value="linkedin" className="mt-4">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
              {/* Post Header */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">Sua Empresa</div>
                    <div className="text-xs text-gray-500">1.234 seguidores</div>
                    <div className="text-xs text-gray-500">Agora · 🌐</div>
                  </div>
                  <button className="text-blue-700 font-semibold text-sm">+ Seguir</button>
                </div>
                <p className="mt-2 text-sm text-gray-900">
                  Confira nosso novo artigo! 📝
                </p>
              </div>

              {/* Link Preview Card */}
              <div className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="relative w-full" style={{ paddingBottom: '52.5%' }}>
                  <img 
                    src={imageUrl || placeholderImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 border-t border-gray-200">
                  <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                    {truncatedTitle || 'Seu título aparecerá aqui'}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {truncatedDescription || 'Sua descrição aparecerá aqui'}
                  </p>
                  <div className="text-xs text-gray-500">{domain}</div>
                </div>
              </div>

              {/* Interactions */}
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <span>👍 125</span>
                  <span className="mx-1">·</span>
                  <span>15 comentários</span>
                </div>
                <div className="flex gap-2 text-sm text-gray-600">
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded flex items-center justify-center gap-1">
                    👍 Gostei
                  </button>
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded flex items-center justify-center gap-1">
                    💬 Comentar
                  </button>
                  <button className="flex-1 py-2 hover:bg-gray-100 rounded flex items-center justify-center gap-1">
                    ↗️ Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info adicional */}
        <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-gray-300">
          <p className="mb-2"><strong>Dica:</strong> As redes sociais usam Open Graph tags para gerar os previews.</p>
          <ul className="space-y-1">
            <li>• Título: até 70 caracteres</li>
            <li>• Descrição: até 200 caracteres</li>
            <li>• Imagem: 1200x630px (proporção 1.91:1)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPreview;

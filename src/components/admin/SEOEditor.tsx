import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Share2, BarChart3 } from 'lucide-react';
import GooglePreview from './GooglePreview';
import SocialPreview from './SocialPreview';
import SEOScore from './SEOScore';

interface SEOEditorProps {
  title: string;
  description: string;
  slug: string;
  coverImageUrl?: string;
  content: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSlugChange: (value: string) => void;
}

const SEOEditor = ({
  title,
  description,
  slug,
  coverImageUrl,
  content,
  onTitleChange,
  onDescriptionChange,
  onSlugChange,
}: SEOEditorProps) => {
  // Gerar slug automaticamente a partir do título
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, ''); // Remove hífens do início e fim
  };

  const handleTitleChange = (value: string) => {
    onTitleChange(value);
    // Auto-gerar slug se estiver vazio
    if (!slug) {
      onSlugChange(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    // Limpar o slug ao digitar
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    onSlugChange(cleanSlug);
  };

  return (
    <div className="space-y-6">
      {/* Editor de Campos SEO */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Otimização SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título SEO */}
          <div>
            <Label className="text-white">Título SEO *</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Digite o título otimizado para SEO..."
              className="bg-gray-700 border-gray-600 text-white mt-2"
              maxLength={60}
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-gray-400">
                Recomendado: 30-60 caracteres
              </span>
              <span className={`font-medium ${
                title.length === 0 ? 'text-red-400' :
                title.length < 30 ? 'text-yellow-400' :
                title.length > 60 ? 'text-red-400' :
                'text-green-400'
              }`}>
                {title.length}/60
              </span>
            </div>
          </div>

          {/* Meta Descrição */}
          <div>
            <Label className="text-white">Meta Descrição *</Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Digite uma descrição atraente que incentive cliques..."
              className="bg-gray-700 border-gray-600 text-white mt-2"
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-gray-400">
                Recomendado: 120-160 caracteres
              </span>
              <span className={`font-medium ${
                description.length === 0 ? 'text-red-400' :
                description.length < 120 ? 'text-yellow-400' :
                description.length > 160 ? 'text-red-400' :
                'text-green-400'
              }`}>
                {description.length}/160
              </span>
            </div>
          </div>

          {/* URL Slug */}
          <div>
            <Label className="text-white">URL Slug *</Label>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                /blog/
              </span>
              <Input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-amigavel-do-post"
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Use apenas letras minúsculas, números e hífens. Evite caracteres especiais.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Previews e Score */}
      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="google" className="data-[state=active]:bg-gray-600">
            <Search className="h-4 w-4 mr-2" />
            Google
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-gray-600">
            <Share2 className="h-4 w-4 mr-2" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="score" className="data-[state=active]:bg-gray-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Score SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="mt-6">
          <GooglePreview
            title={title}
            description={description}
            slug={slug}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialPreview
            title={title}
            description={description}
            imageUrl={coverImageUrl}
          />
        </TabsContent>

        <TabsContent value="score" className="mt-6">
          <SEOScore
            title={title}
            description={description}
            slug={slug}
            content={content}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOEditor;

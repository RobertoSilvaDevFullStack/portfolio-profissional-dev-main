import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Check,
  ExternalLink,
  Linkedin,
  Instagram,
  Sparkles,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import useShare from "@/hooks/useShare";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  slug: string;
  author_name: string;
}

interface SocialShareButtonProps {
  post: Post;
  platform: "linkedin" | "instagram";
}

const SocialShareButton = ({ post, platform }: SocialShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const {
    createSummaryText: createHookSummary,
    copyToClipboard: copyHook,
    shareToLinkedIn,
    shareToInstagram,
    getPostUrl,
    generateShareMetrics,
  } = useShare();

  const postUrl = getPostUrl(post.slug);

  // Configurações específicas por plataforma
  const platformConfig = {
    linkedin: {
      icon: Linkedin,
      name: "LinkedIn",
      color: "bg-blue-600 hover:bg-blue-700 border-blue-500",
      maxChars: 3000,
      defaultText: `🚀 ${post.title}

${post.excerpt || ""}

Leia o artigo completo em: ${postUrl}

#desenvolvimento #tecnologia #blog #programação`,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        postUrl
      )}`,
    },
    instagram: {
      icon: Instagram,
      name: "Instagram",
      color:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-500",
      maxChars: 2200,
      defaultText: `🚀 ${post.title}

${post.excerpt || ""}

💻 Link no perfil para ler o artigo completo!

#desenvolvimento #tecnologia #blog #programação #dev #webdev`,
      shareUrl: null, // Instagram não permite compartilhamento direto via URL
    },
  };

  const config = platformConfig[platform];
  const IconComponent = config.icon;

  // Função para criar texto resumido automático
  const createSummaryText = () => {
    return createHookSummary(post, platform);
  };

  const handleOpen = () => {
    setCustomText(config.defaultText);
    setIsOpen(true);
  };

  const copyToClipboard = async (text: string, type: "url" | "text") => {
    const success = await copyHook(text);
    if (success) {
      if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      }
      showSuccess(`${type === "url" ? "URL" : "Texto"} copiado!`);
    } else {
      showError("Erro ao copiar para a área de transferência");
    }
  };

  const generateSummary = () => {
    setCustomText(createSummaryText());
  };

  const openPlatform = async () => {
    await generateShareMetrics(post.id, platform);

    if (platform === "linkedin") {
      shareToLinkedIn(post, customText);
    } else {
      shareToInstagram(post, customText);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpen}
          className={`${config.color} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-medium`}
        >
          <IconComponent size={20} />
          {config.name}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent size={24} />
            Compartilhar no {config.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview do Post */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Preview do Post:</h3>
            <h4 className="text-light-cyan font-bold">{post.title}</h4>
            <p className="text-gray-300 text-sm mt-1">Por {post.author_name}</p>
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-32 object-cover rounded mt-3"
              />
            )}
          </div>

          {/* URL do Post */}
          <div>
            <Label htmlFor="post-url">URL do Post:</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="post-url"
                value={postUrl}
                readOnly
                className="bg-gray-700 border-gray-600"
              />
              <Button
                onClick={() => copyToClipboard(postUrl, "url")}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-700"
              >
                {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          {/* Texto para Compartilhamento */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="share-text">Texto para Compartilhamento:</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={generateSummary}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Gerar Resumo
                </Button>
                <Button
                  onClick={() => copyToClipboard(customText, "text")}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-700"
                >
                  {copiedText ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
            <Textarea
              id="share-text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={8}
              className="bg-gray-700 border-gray-600"
              placeholder={`Digite o texto para compartilhar no ${config.name}...`}
            />
            <p className="text-sm text-gray-400 mt-1">
              {customText.length}/{config.maxChars} caracteres
              {customText.length > config.maxChars && (
                <span className="text-red-400 ml-2">Limite excedido!</span>
              )}
            </p>
          </div>

          {/* Dicas específicas da plataforma */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Dicas para {config.name}:</h4>
            {platform === "linkedin" ? (
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use hashtags profissionais relacionadas ao conteúdo</li>
                <li>• Mencione insights ou learnings principais</li>
                <li>• Inclua uma call-to-action para ler o artigo completo</li>
                <li>• O LinkedIn permite até 3.000 caracteres</li>
              </ul>
            ) : (
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use hashtags populares para aumentar o alcance</li>
                <li>• Mencione "link no perfil" ou "link na bio"</li>
                <li>• Use emojis para deixar mais visual</li>
                <li>• Considere criar um carrossel ou story</li>
              </ul>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              onClick={openPlatform}
              className={`${config.color} flex-1 flex items-center justify-center gap-2`}
            >
              <ExternalLink size={16} />
              Abrir {config.name}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              Fechar
            </Button>
          </div>

          {platform === "instagram" && (
            <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
              <p className="text-yellow-200 text-sm">
                📱 <strong>Instagram:</strong> Cole o texto copiado em um novo
                post no Instagram. Não esqueça de adicionar o link do artigo no
                seu perfil ou story!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareButton;

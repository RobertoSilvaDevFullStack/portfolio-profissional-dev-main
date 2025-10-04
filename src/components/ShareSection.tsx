import { Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import SocialShareButton from "./SocialShareButton";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  slug: string;
  author_name: string;
}

interface ShareSectionProps {
  post: Post;
}

const ShareSection = ({ post }: ShareSectionProps) => {
  const postUrl = `${window.location.origin}/blog/${post.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      showSuccess("Link copiado para a área de transferência!");
    } catch (error) {
      showSuccess("Link: " + postUrl);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || `Confira este artigo: ${post.title}`,
          url: postUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="border-t border-gray-700 pt-8 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Share2 size={24} className="text-light-cyan" />
        <h3 className="text-xl font-bold text-white">
          Compartilhe este artigo
        </h3>
      </div>

      <div className="bg-gray-900/50 p-6 rounded-lg">
        <p className="text-gray-300 mb-4">
          Gostou do conteúdo? Compartilhe com sua rede e ajude outros
          profissionais!
        </p>

        <div className="flex flex-wrap gap-3">
          {/* LinkedIn */}
          <SocialShareButton post={post} platform="linkedin" />

          {/* Instagram */}
          <SocialShareButton post={post} platform="instagram" />

          {/* Copiar Link */}
          <Button
            onClick={copyLink}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <LinkIcon size={20} />
            Copiar Link
          </Button>

          {/* Compartilhamento Nativo (Mobile) */}
          {navigator.share && (
            <Button
              onClick={shareNative}
              variant="outline"
              className="border-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
            >
              <Share2 size={20} />
              Compartilhar
            </Button>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">📎 Link direto:</p>
          <code className="text-light-cyan text-sm break-all bg-gray-700 px-2 py-1 rounded">
            {postUrl}
          </code>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;

import { useState } from "react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_name: string;
}

interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const getPostUrl = (slug: string) => {
    return `${window.location.origin}/blog/${slug}`;
  };

  const createLinkedInText = (post: Post) => {
    const url = getPostUrl(post.slug);
    return `🚀 ${post.title}

${
  post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
}

✨ Principais insights:
• Dicas práticas de desenvolvimento
• Experiências reais do mercado
• Melhores práticas e tecnologias

📖 Leia o artigo completo: ${url}

#desenvolvimento #tecnologia #programação #webdev #blog #carreira`;
  };

  const createInstagramText = (post: Post) => {
    return `🚀 ${post.title}

${
  post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
}

💡 Novo post no blog!
💻 Link no perfil para ler completo

#desenvolvimento #tecnologia #programação #webdev #blog #dev #coding #tech #carreira #dicas`;
  };

  const createSummaryText = (
    post: Post,
    platform: "linkedin" | "instagram"
  ) => {
    if (platform === "linkedin") {
      return createLinkedInText(post);
    } else {
      return createInstagramText(post);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return false;
    }
  };

  const shareToLinkedIn = async (post: Post, customText?: string) => {
    setIsSharing(true);
    const url = getPostUrl(post.slug);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;

    if (customText) {
      const copied = await copyToClipboard(customText);
      if (copied) {
        showSuccess("Texto copiado! Cole no LinkedIn junto com o link.");
      }
    }

    window.open(linkedInUrl, "_blank", "width=600,height=400");
    setIsSharing(false);
  };

  const shareToInstagram = async (post: Post, customText?: string) => {
    setIsSharing(true);
    const text = customText || createInstagramText(post);

    const copied = await copyToClipboard(text);
    if (copied) {
      showSuccess(
        "Texto copiado! Cole no Instagram e adicione o link no seu perfil."
      );
      window.open("https://www.instagram.com/", "_blank");
    } else {
      showError("Erro ao copiar texto. Tente novamente.");
    }
    setIsSharing(false);
  };

  const shareNative = async (post: Post) => {
    if (!navigator.share) {
      return shareToClipboard(post);
    }

    const shareData: ShareData = {
      title: post.title,
      text: post.excerpt || `Confira este artigo interessante: ${post.title}`,
      url: getPostUrl(post.slug),
    };

    try {
      setIsSharing(true);
      await navigator.share(shareData);
      showSuccess("Artigo compartilhado com sucesso!");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
        showError("Erro ao compartilhar. Tente copiar o link.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const shareToClipboard = async (post: Post) => {
    const url = getPostUrl(post.slug);
    const copied = await copyToClipboard(url);

    if (copied) {
      showSuccess("Link copiado para a área de transferência!");
    } else {
      showError("Erro ao copiar link. Tente novamente.");
    }
  };

  const generateShareMetrics = async (postId: string, platform: string) => {
    try {
      // Registrar o compartilhamento no banco de dados
      const { error } = await supabase.rpc("log_share", {
        p_post_id: postId,
        p_platform: platform,
        p_user_agent: navigator.userAgent,
        p_referrer: document.referrer || null,
      });

      if (error) {
        console.error("Error logging share:", error);
      } else {
        console.log(`Share tracked: ${platform} - ${postId}`);
      }
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  };

  return {
    isSharing,
    createLinkedInText,
    createInstagramText,
    createSummaryText,
    copyToClipboard,
    shareToLinkedIn,
    shareToInstagram,
    shareNative,
    shareToClipboard,
    generateShareMetrics,
    getPostUrl,
  };
};

export default useShare;

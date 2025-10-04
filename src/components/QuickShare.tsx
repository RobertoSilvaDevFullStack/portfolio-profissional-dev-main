import { Share2, Linkedin, Instagram, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useShare from "@/hooks/useShare";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  content?: string;
  author_name?: string;
}

interface QuickShareProps {
  post: Post;
}

const QuickShare = ({ post }: QuickShareProps) => {
  const {
    shareToLinkedIn,
    shareToInstagram,
    shareToClipboard,
    generateShareMetrics,
  } = useShare();

  const handleLinkedInShare = async () => {
    await generateShareMetrics(post.id, "linkedin");
    const fullPost = {
      ...post,
      content: post.content || "",
      author_name: post.author_name || "",
    };
    shareToLinkedIn(fullPost);
  };

  const handleInstagramShare = async () => {
    await generateShareMetrics(post.id, "instagram");
    const fullPost = {
      ...post,
      content: post.content || "",
      author_name: post.author_name || "",
    };
    shareToInstagram(fullPost);
  };

  const handleCopyLink = async () => {
    await generateShareMetrics(post.id, "copy");
    const fullPost = {
      ...post,
      content: post.content || "",
      author_name: post.author_name || "",
    };
    shareToClipboard(fullPost);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-light-cyan hover:bg-gray-700 p-2"
          onClick={(e) => e.preventDefault()} // Previne navegação do Link pai
        >
          <Share2 size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
        <DropdownMenuItem
          onClick={handleLinkedInShare}
          className="flex items-center gap-2 hover:bg-gray-700 cursor-pointer"
        >
          <Linkedin size={16} className="text-blue-500" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleInstagramShare}
          className="flex items-center gap-2 hover:bg-gray-700 cursor-pointer"
        >
          <Instagram size={16} className="text-pink-500" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="flex items-center gap-2 hover:bg-gray-700 cursor-pointer"
        >
          <Copy size={16} className="text-gray-400" />
          Copiar Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickShare;

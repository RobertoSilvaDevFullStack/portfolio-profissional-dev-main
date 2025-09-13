import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className="bg-gray-800 border-gray-700 text-white flex flex-col h-full overflow-hidden">
      <CardHeader className="p-0">
        <Link to={`/blog/${post.slug}`}>
          <img 
            src={post.cover_image_url || '/placeholder.svg'} 
            alt={post.title} 
            className="w-full h-48 object-cover" 
          />
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-light-cyan mb-2 text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
        </CardTitle>
        <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <span className="text-sm text-gray-400">{postDate}</span>
        <Link to={`/blog/${post.slug}`} className="text-light-cyan hover:underline flex items-center">
          Ler mais <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
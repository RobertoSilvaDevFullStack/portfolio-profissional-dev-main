import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import MatrixRain from '@/components/MatrixRain';
import SEO from '@/components/SEO';
import PostAssetCarousel from '@/components/PostAssetCarousel';
import CommentsSection from '@/components/comments/CommentsSection';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
  author_name: string;
  author_avatar_url: string;
  asset_urls: string[] | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const postDate = post ? new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : '';

  const hasCarousel = post?.asset_urls && post.asset_urls.length > 0;

  return (
    <div className="bg-dark-navy text-gray-200 font-sans antialiased">
      {post && (
        <SEO
          title={post.title}
          description={post.excerpt || post.content.substring(0, 160)}
          type="article"
          imageUrl={post.cover_image_url}
        />
      )}
      <MatrixRain />
      <Header />
      <main className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : post ? (
            <>
              <article className="prose prose-invert prose-lg max-w-none prose-headings:text-light-cyan prose-a:text-light-cyan hover:prose-a:underline">
                <Link to="/#blog" className="flex items-center gap-2 text-gray-400 hover:text-light-cyan mb-8 no-underline">
                  <ArrowLeft size={20} />
                  Voltar para o Blog
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{post.title}</h1>
                <div className="flex items-center gap-4 my-4">
                  <img src={post.author_avatar_url || '/placeholder.svg'} alt={post.author_name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-white not-prose">{post.author_name || 'Autor'}</p>
                    <p className="text-gray-400 text-sm not-prose">{postDate}</p>
                  </div>
                </div>
                
                {hasCarousel ? (
                  <PostAssetCarousel assetUrls={post.asset_urls!} />
                ) : (
                  post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="w-full rounded-lg my-8" />
                )}

                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
              <CommentsSection postId={post.id} />
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold">Post não encontrado</h1>
              <p className="mt-4">O post que você está procurando não existe.</p>
              <Link to="/" className="text-light-cyan hover:underline mt-6 inline-block">Voltar para a Home</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
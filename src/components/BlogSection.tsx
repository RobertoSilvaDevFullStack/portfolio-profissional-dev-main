import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  createdAt: string;
  cover_image_url: string;
  created_at: string;
}

const BlogSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await api.posts.list('published');
        // Map to ensure all required fields exist
        const mappedPosts: PostData[] = data.posts.slice(0, 3).map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          coverImageUrl: p.coverImageUrl || '',
          createdAt: p.createdAt,
          cover_image_url: p.coverImageUrl || '',
          created_at: p.createdAt,
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section {...props} className="w-full py-20 md:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Últimas do Blog</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
          <p className="text-gray-300 mt-6">
            Compartilhando insights sobre desenvolvimento, tecnologia e carreira.
          </p>
        </div>
        {/* Mobile: Horizontal Scroll Carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 pb-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex-[0_0_85%] snap-center">
                  <Skeleton className="h-96 w-full bg-gray-700" />
                </div>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="flex-[0_0_85%] snap-center">
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum post encontrado.</p>
            )}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-96 w-full bg-gray-700" />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-gray-400">Nenhum post encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
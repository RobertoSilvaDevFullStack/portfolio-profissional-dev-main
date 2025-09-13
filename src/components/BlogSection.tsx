import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
}

const BlogSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <section {...props} className="w-full py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Últimas do Blog</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
          <p className="text-gray-300 mt-6">
            Compartilhando insights sobre desenvolvimento, tecnologia e carreira.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[192px] w-full rounded-xl" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
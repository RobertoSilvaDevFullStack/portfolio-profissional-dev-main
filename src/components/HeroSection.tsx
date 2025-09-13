import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
  updated_at: string;
}

const HeroSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('hero_title, hero_subtitle, hero_description, hero_image_url, updated_at')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching hero content:', error);
      } else {
        setContent(data);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const imageUrlWithCacheBust = content ? `${content.hero_image_url}?t=${new Date(content.updated_at).getTime()}` : "/placeholder.svg";

  return (
    <section {...props} className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-40" />
              </div>
            ) : content ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  {content.hero_title}
                </h1>
                <p className="text-xl md:text-2xl text-light-cyan mb-6">
                  {content.hero_subtitle}
                </p>
                <p className="text-gray-300 mb-8">
                  {content.hero_description}
                </p>
                <a href="#contato">
                  <Button size="lg" className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90 font-bold">
                    Vamos Conversar
                  </Button>
                </a>
              </>
            ) : (
              <p>Conteúdo não encontrado.</p>
            )}
          </div>
          <div className="flex justify-center">
            {loading ? (
              <Skeleton className="rounded-full w-64 h-64 md:w-80 md:h-80" />
            ) : (
              <img
                src={imageUrlWithCacheBust}
                alt="Roberto Vicente da Silva"
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-light-cyan shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
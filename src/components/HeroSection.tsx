import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface HeroContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
}

const HeroSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetch with hardcoded data to replace Supabase dependency
    const loadContent = () => {
      setLoading(true);

      const staticData = {
        hero_title: "Olá, sou Roberto Vicente da Silva.",
        hero_subtitle: "Desenvolvedor Full-Stack em Formação",
        hero_description: "Desenvolvimento de aplicações web responsivas e funcionais, unindo conhecimentos técnicos em programação com experiência comercial e em marketing digital. Busco criar soluções que combinem usabilidade, performance e resultados para o negócio.",
        hero_image_url: "/lovable-uploads/27145738-f86a-4933-9137-25d259501570.png"
      };

      setContent(staticData);
      setLoading(false);
    };

    loadContent();
  }, []);

  const imageUrlWithCacheBust = content?.hero_image_url || "/placeholder.svg";

  return (
    <section {...props} className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            {loading ? (
              <div className="space-y-4">
                {/* Skeleton loader removed for brevity/static load */}
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
              <div className="rounded-full w-64 h-64 md:w-80 md:h-80 bg-gray-700 animate-pulse" />
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
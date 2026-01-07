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
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id={id}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Olá, eu sou{" "}
                <span className="text-light-cyan">Roberto Vicente da Silva</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Desenvolvedor Full Stack
              </p>
            </div>
            <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto md:mx-0">
              Transformo ideias em soluções digitais inovadoras. Especializado em
              criar experiências web modernas e eficientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                onClick={() => scrollToSection("projetos")}
                className="bg-light-cyan text-dark-navy hover:bg-light-cyan/90 transition-all duration-300 hover:scale-105"
              >
                Ver Projetos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => scrollToSection("contato")}
                variant="outline"
                className="border-light-cyan text-light-cyan hover:bg-light-cyan/10"
              >
                Entre em Contato
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <div className="rounded-full w-64 h-64 md:w-80 md:h-80 bg-gray-700 animate-pulse" />
            ) : (
              <OptimizedImage
                src="/foto-pessoal.jpeg"
                alt="Roberto Vicente da Silva"
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-light-cyan shadow-lg"
                width={320}
                height={320}
                priority={true}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
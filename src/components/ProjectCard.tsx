import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  link: string;
  technologies: string[];
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Project click analytics removed - can be added later via API if needed

  const sanitizeTechName = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '') // Remove espaços
      .replace(/\./g, '');  // Remove pontos (ex: Next.js -> nextjs)
  };

  const sanitizedTechnologies = project.technologies
    .map(sanitizeTechName)
    .filter(Boolean) // Remove quaisquer strings vazias que possam resultar de dados incorretos
    .join(',');

  return (
    <Card className="bg-gray-800 border-gray-700 text-white flex flex-col h-full">
      <CardHeader>
        <div className="overflow-hidden relative rounded-lg" ref={emblaRef}>
          <div className="flex">
            {project.images && project.images.length > 0 ? project.images.map((url, index) => {
              const isPdf = url.toLowerCase().endsWith('.pdf');
              return (
                <div className="flex-grow-0 flex-shrink-0 w-full" key={index}>
                  {isPdf ? (
                    <div className="w-full h-48 bg-gray-700 flex flex-col items-center justify-center text-gray-300">
                      <FileText size={48} />
                      <span className="mt-2 text-sm text-center px-2 truncate">{url.split('/').pop()}</span>
                    </div>
                  ) : (
                    <img src={url} alt={`${project.title} screenshot ${index + 1}`} className="w-full h-48 object-cover" />
                  )}
                </div>
              );
            }) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>
          {project.images && project.images.length > 1 && (
            <>
              <button onClick={scrollPrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                <ArrowLeft size={20} />
              </button>
              <button onClick={scrollNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 md:p-6">
        <CardTitle className="text-light-cyan mb-2 text-lg md:text-xl">{project.title}</CardTitle>
        <CardDescription className="text-gray-300 mb-3 md:mb-4 whitespace-pre-wrap text-sm md:text-base line-clamp-3 md:line-clamp-none">{project.description}</CardDescription>
        <div>
          <h4 className="font-semibold text-gray-200 mb-1.5 md:mb-2 text-sm">Tecnologias:</h4>
          {sanitizedTechnologies && (
            <img
              src={`https://skillicons.dev/icons?i=${sanitizedTechnologies}`}
              alt="Tecnologias usadas no projeto"
              className="h-7 md:h-8"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-2 md:pt-6">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
          onClick={() => {
            // Track click without blocking navigation
            import('@/lib/api-client').then(({ api }) => {
              api.analytics.logProjectClick(project.id).catch(console.error);
            });
          }}
        >
          <Button className="w-full bg-light-cyan text-dark-navy hover:bg-light-cyan/90 font-semibold">
            Visitar Projeto
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ProjectCard from './ProjectCard';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  githubUrl: string;
  technologies: string[];
  images: string[];
  link: string;
}

const PortfolioSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 6000 })]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await api.projects.list('active');
        // Map backend fields ensuring all required fields exist
        const mappedProjects: ProjectData[] = data.projects.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          imageUrl: p.imageUrl || '',
          projectUrl: p.projectUrl || '',
          githubUrl: p.githubUrl || '',
          technologies: p.technologies || [],
          images: p.imageUrl ? [p.imageUrl] : [],
          link: p.projectUrl || p.githubUrl || '#',
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Meus Projetos</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[192px] w-full rounded-xl" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {projects.map((project) => (
                <div className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4" key={project.id}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
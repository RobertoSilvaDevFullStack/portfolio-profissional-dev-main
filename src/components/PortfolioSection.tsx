import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FileText } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ProjectCard from './ProjectCard';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getAllCaseStudies } from '@/data/caseStudies';

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
  const navigate = useNavigate();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 6000 })]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const caseStudies = getAllCaseStudies();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await api.projects.list('active');
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

        {/* Case Studies Section */}
        {caseStudies.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">📚 Case Studies Detalhados</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-light-cyan transition-all cursor-pointer group"
                  onClick={() => navigate(`/case-study/${caseStudy.slug}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-light-cyan" />
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-light-cyan transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-light-cyan transition-colors">
                    {caseStudy.title}
                  </h4>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {caseStudy.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {caseStudy.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">
                        +{caseStudy.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 {caseStudy.duration}</span>
                    <span>👤 {caseStudy.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects Section */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">💼 Outros Projetos</h3>
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
      </div>
    </section>
  );
};

export default PortfolioSection;
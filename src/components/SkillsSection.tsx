import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Skill {
  id: string;
  category: string;
  technologies: string;
}

const SkillsSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching skills:', error);
      } else {
        setSkills(data);
      }
      setLoading(false);
    };

    fetchSkills();
  }, []);

  const sanitizeAndFormatTechString = (techString: string) => {
    if (!techString) return '';
    return techString
      .split(',')
      .map(name => name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/\./g, '')
      )
      .filter(Boolean)
      .join(',');
  };

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Habilidades e Tecnologias</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>
        <div className="space-y-10">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          ) : (
            skills.map((skill) => {
              const sanitizedTechnologies = sanitizeAndFormatTechString(skill.technologies);
              return (
                <div key={skill.id}>
                  <h3 className="text-2xl font-semibold text-light-cyan text-center mb-6">{skill.category}</h3>
                  <div className="flex justify-center items-center flex-wrap gap-4">
                    {sanitizedTechnologies && (
                      <img 
                        src={`https://skillicons.dev/icons?i=${sanitizedTechnologies}`} 
                        alt={`Ícones de tecnologia para ${skill.category}`}
                        className="h-12"
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
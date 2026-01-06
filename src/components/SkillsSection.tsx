import React from 'react';

const SkillsSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const skills = [
    {
      category: "Front-end",
      icons: "html,css,js,react,ts,sass,tailwind"
    },
    {
      category: "Back-end",
      icons: "php,mysql,postgres,nodejs,express,laravel,supabase"
    },
    {
      category: "Outras Ferramentas",
      icons: "git,figma,vercel,docker,aws"
    }
  ];

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Habilidades e Tecnologias</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>

        <div className="space-y-16">
          {skills.map((skillGroup, index) => (
            <div key={index} className="flex flex-col items-center space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-light-cyan">
                {skillGroup.category}
              </h3>
              <div className="relative overflow-hidden rounded-lg p-4">
                {/* Light beam effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 animate-light-sweep bg-gradient-to-r from-transparent via-light-cyan/20 to-transparent"></div>
                </div>

                {/* Skills icons */}
                <div className="relative flex justify-center transition-transform hover:scale-105 duration-300">
                  <img
                    src={`https://skillicons.dev/icons?i=${skillGroup.icons}&theme=dark`}
                    alt={`${skillGroup.category} icons`}
                    className="h-14 md:h-16 lg:h-20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
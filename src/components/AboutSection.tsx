import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react';

interface AboutContent {
  about_professional_profile: string;
  about_experience_summary: string;
}

const AboutSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetch with hardcoded data
    const loadContent = () => {
      setLoading(true);
      const staticData = {
        about_professional_profile: "Sou um desenvolvedor Web Full-Stack em formação, com background em suporte técnico e desenvolvimento de sistemas. Controle de demandas (SLA, Trello).\n\nMetodologia\nAcredito em código limpo, bem documentado e testes automatizados.",
        about_experience_summary: "Habilidades Técnicas\nHTML, CSS, JavaScript, React, Node.js, TypeScript.\n\nExperiência Comercial\nAtendimento ao cliente, negociação e gestão de projetos."
      };
      setContent(staticData);
      setLoading(false);
    };

    loadContent();
  }, []);

  const renderProfileWithSubtitles = (text: string) => {
    const subtitles = [
      "Experiência Comprovada",
      "Metodologia",
      "Diferencial Competitivo",
      "Visão de Mercado"
    ];

    const regex = new RegExp(`(${subtitles.join('|')})`, 'g');
    const parts = text.split(regex).filter(part => part.trim() !== '');

    const elements: JSX.Element[] = [];
    let isFirstParagraph = true;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (subtitles.includes(part)) {
        const content = parts[i + 1] ? parts[i + 1].trim() : '';
        elements.push(
          <div key={part}>
            <h4 className="font-semibold text-white mt-4 text-lg">{part}</h4>
            <p className="text-gray-300">{content}</p>
          </div>
        );
        i++;
      } else {
        if (isFirstParagraph) {
          elements.push(<p key="initial-paragraph" className="text-gray-300">{part}</p>);
          isFirstParagraph = false;
        }
      }
    }
    return elements;
  };

  const renderExperienceSummary = (text: string) => {
    const subtitles = [
      "Habilidades Técnicas",
      "Experiência Comercial",
      "Portfólio Diversificado",
      "Diferenciais Competitivos",
      "Objetivos Profissionais"
    ];

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections: { subtitle: string; items: string[] }[] = [];
    let currentSection: { subtitle: string; items: string[] } | null = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (subtitles.includes(trimmedLine)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { subtitle: trimmedLine, items: [] };
      } else if (currentSection) {
        currentSection.items.push(trimmedLine);
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections.map(section => (
      <div key={section.subtitle} className="mb-4">
        <h4 className="font-semibold text-white text-lg">{section.subtitle}</h4>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {section.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Sobre Mim</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>
        <div className="max-w-4xl mx-auto text-left">
          {loading ? (
            <div className="h-96 w-full bg-gray-700 animate-pulse rounded-md" />
          ) : content ? (
            <Card className="bg-gray-800 border-gray-700 text-gray-300">
              <CardContent className="p-6 md:p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-light-cyan mb-4">Perfil Profissional</h3>
                  {renderProfileWithSubtitles(content.about_professional_profile)}
                </div>
                <div className="border-t border-gray-700"></div>
                <div>
                  <h3 className="text-2xl font-bold text-light-cyan mb-4">Resumo da Experiência</h3>
                  {renderExperienceSummary(content.about_experience_summary)}
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>Conteúdo não encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
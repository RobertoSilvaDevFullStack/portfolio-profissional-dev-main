import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Share2, Zap, Wrench, Settings } from 'lucide-react';
import React from 'react';
import ServicesCarousel from './ServicesCarousel';

const ServicesSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const services = [
    {
      icon: Code,
      title: 'Desenvolvimento Customizado',
      description: 'Sistemas Web e Aplicativos completos e responsivos, da prototipagem no Figma até o deploy.'
    },
    {
      icon: Share2,
      title: 'APIs e Integrações',
      description: 'Construção de APIs RESTful robustas e integração com serviços de terceiros para comunicação eficiente.'
    },
    {
      icon: Zap,
      title: 'Performance e Segurança',
      description: 'Implementação das melhores práticas para garantir que seus sistemas sejam rápidos, seguros e escaláveis.'
    },
    {
      icon: Settings,
      title: 'Consultoria em Arquitetura',
      description: 'Definição da melhor arquitetura para seu projeto, garantindo escalabilidade e manutenibilidade.'
    },
    {
      icon: Wrench,
      title: 'Manutenção e Evolução',
      description: 'Melhorias, refatorações e novas funcionalidades em sistemas existentes para garantir sua longevidade.'
    }
  ];

  return (
    <section {...props} className="w-full py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">O Que Eu Ofereço</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>
        {/* Mobile: Carousel */}
        <div className="block md:hidden">
          <ServicesCarousel />
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="bg-gray-800 border-gray-700 text-center p-6 hover:border-light-cyan transition-colors">
                <CardHeader className="flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-light-cyan" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-white text-xl mb-2">{service.title}</CardTitle>
                  <p className="text-gray-400">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
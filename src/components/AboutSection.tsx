import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Code, Heart, Briefcase, Target, Zap, Users, BookOpen, Gamepad2, Church, Baby } from 'lucide-react';

const AboutSection = (props: React.HTMLAttributes<HTMLElement>) => {
  const stats = [
    { label: 'Anos de Experiência', value: '5+', sublabel: 'Mercado Imobiliário' },
    { label: 'Projetos Desenvolvidos', value: '15+', sublabel: 'Web & Mobile' },
    { label: 'Tecnologias', value: '20+', sublabel: 'Frontend & Backend' },
    { label: 'Clientes Satisfeitos', value: '100%', sublabel: 'Taxa de Satisfação' }
  ];

  const timeline = [
    {
      year: '2019-2024',
      title: 'Corretor de Imóveis',
      icon: Briefcase,
      description: 'Expertise em vendas, negociação e relacionamento com clientes',
      highlights: [
        'Gestão de tráfego pago desde 2020',
        'Especialização em geração de leads',
        'Conhecimento profundo em métricas de conversão'
      ]
    },
    {
      year: '2023',
      title: 'Transição para Tech',
      icon: Code,
      description: 'Decisão de unir paixão por tecnologia com experiência comercial',
      highlights: [
        'Início dos estudos em desenvolvimento',
        'Primeiros projetos pessoais',
        'Descoberta da combinação perfeita: código + negócios'
      ]
    },
    {
      year: '2024',
      title: 'Desenvolvedor Full-Stack',
      icon: Zap,
      description: 'Cursando Análise e Desenvolvimento de Sistemas',
      highlights: [
        'Especialização em React e Node.js',
        'Foco em performance e SEO',
        'Projetos comerciais com resultados mensuráveis'
      ]
    },
    {
      year: '2025-2026',
      title: 'Crescimento & Novos Desafios',
      icon: Target,
      description: 'Buscando oportunidades para crescer e contribuir',
      highlights: [
        'Portfolio profissional com case studies',
        'Especialização em conversão e performance',
        'Pronto para novos desafios em equipes ágeis'
      ]
    }
  ];

  const values = [
    {
      icon: Zap,
      title: 'Performance',
      description: 'Código otimizado, sites rápidos, usuários felizes. PageSpeed não é vaidade, é necessidade.'
    },
    {
      icon: Target,
      title: 'Resultados',
      description: 'Métricas importam. Cada linha de código deve contribuir para o sucesso do negócio.'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalho em equipe, comunicação clara e vontade de aprender com os melhores.'
    },
    {
      icon: BookOpen,
      title: 'Aprendizado',
      description: 'Tecnologia evolui rápido. Eu também. Sempre estudando, sempre crescendo.'
    }
  ];

  const personalInterests = [
    {
      icon: Gamepad2,
      title: 'Gaming',
      description: 'World of Warcraft e F1 2025 nas horas vagas'
    },
    {
      icon: Church,
      title: 'Fé',
      description: 'Missa aos domingos é tradição que não abrimos mão'
    },
    {
      icon: Heart,
      title: 'Família',
      description: 'Fins de semana com minha esposa são sagrados'
    },
    {
      icon: Baby,
      title: 'Futuro Papai',
      description: 'Prestes a me tornar pai! Bebê chegando em 2 meses 👶'
    }
  ];

  return (
    <section {...props} className="w-full bg-dark-navy py-20 md:py-32 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Sobre Mim</h2>
          <div className="w-24 h-1 bg-light-cyan mx-auto mt-4"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-light-cyan mb-2">
                {stat.value}
              </div>
              <div className="text-white font-semibold">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <Card className="bg-gray-800 border-gray-700 mb-16">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-light-cyan mb-6">
              Minha História
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Minha jornada no desenvolvimento começou de um lugar inusitado: <span className="text-white font-semibold">o mercado imobiliário</span>. Durante 5 anos como corretor, percebi que a tecnologia não era apenas uma ferramenta, mas a chave para transformar negócios. Essa percepção mudou minha vida.
              </p>
              <p>
                Enquanto gerenciava tráfego pago e otimizava funis de vendas, me apaixonei pelo processo de <span className="text-light-cyan">criar soluções que realmente funcionam</span>. Não bastava ter um site bonito - ele precisava converter, performar, gerar resultados. Foi aí que decidi: quero construir essas soluções com minhas próprias mãos.
              </p>
              <p>
                Hoje, como <span className="text-white font-semibold">desenvolvedor full-stack</span>, trago uma combinação única: entendo de código E entendo de negócios. Sei que por trás de cada projeto existe um objetivo comercial, uma métrica a atingir, um problema real a resolver.
              </p>
              <p>
                Meu diferencial? <span className="text-light-cyan">Não desenvolvo apenas sistemas - desenvolvo soluções que impactam o resultado final</span>. Cada linha de código é pensada para performance, cada feature é validada pelo ROI, cada projeto é tratado como se fosse meu próprio negócio.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Minha Jornada
          </h3>
          <div className="space-y-8">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  {/* Line connector */}
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute left-6 top-16 w-0.5 h-full bg-gray-700"></div>
                  )}

                  <Card className="bg-gray-800 border-gray-700 hover:border-light-cyan transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-light-cyan/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-light-cyan" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-light-cyan font-bold">{item.year}</span>
                            <h4 className="text-xl font-bold text-white">{item.title}</h4>
                          </div>
                          <p className="text-gray-300 mb-3">{item.description}</p>
                          <ul className="space-y-1">
                            {item.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                                <span className="text-light-cyan mt-1">▸</span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Meus Valores
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:border-light-cyan transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-8 h-8 text-light-cyan" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{value.title}</h4>
                        <p className="text-gray-300">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Differentials */}
        <Card className="bg-gradient-to-r from-light-cyan/10 to-purple-500/10 border-light-cyan/30 mb-16">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              O Que Me Torna Único
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-light-cyan mb-3">
                  🎯 Visão Dupla: Comercial + Técnica
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    5 anos de experiência em vendas e negociação
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Entendo de métricas, conversão e ROI
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Traduzo necessidades de negócio em código
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Foco em resultados mensuráveis
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-light-cyan mb-3">
                  🏠 Especialização Imobiliária
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Conhecimento profundo do mercado imobiliário
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Entendo as dores e necessidades do setor
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Experiência em marketing digital para imóveis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-light-cyan mt-1">✓</span>
                    Soluções específicas que geram leads qualificados
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Interests */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Além do Código
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalInterests.map((interest, index) => {
              const Icon = interest.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700 text-center hover:border-light-cyan transition-colors">
                  <CardContent className="p-6">
                    <Icon className="w-10 h-10 text-light-cyan mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-white mb-2">{interest.title}</h4>
                    <p className="text-gray-400 text-sm">{interest.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Special highlight for baby */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-lg">
              <span className="text-light-cyan font-semibold">2026 será especial:</span> além de crescer como desenvolvedor, vou me tornar pai!
              <span className="ml-2">👶💙</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
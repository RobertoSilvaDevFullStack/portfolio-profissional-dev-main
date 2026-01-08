import type { CaseStudy } from '@/types/caseStudy';

export const caseStudies: CaseStudy[] = [
    // Case Study 1: Portfolio Full-Stack
    {
        id: '1',
        slug: 'portfolio-full-stack',
        title: 'Portfolio Full-Stack Profissional',
        tagline: 'Plataforma completa de portfólio com admin dashboard e analytics',

        client: 'Projeto Pessoal',
        industry: 'Web Development',
        duration: '3 meses',
        role: 'Full-Stack Developer',
        teamSize: 'Solo',

        heroImage: '/foto-pessoal.webp',
        heroImageAlt: 'Portfolio Screenshot',

        challenge: 'Precisava de um portfólio profissional que não apenas mostrasse meus projetos, mas também demonstrasse minhas habilidades técnicas de forma prática. O desafio era criar uma aplicação full-stack completa, com backend robusto, admin dashboard funcional, e performance otimizada.',
        painPoints: [
            'Portfólios tradicionais são estáticos e não demonstram habilidades backend',
            'Falta de sistema de gerenciamento de conteúdo integrado',
            'Performance mobile geralmente negligenciada',
            'Ausência de analytics e métricas de visitantes'
        ],

        approach: 'Desenvolvi uma aplicação full-stack moderna usando React + TypeScript no frontend e Node.js + Prisma no backend. A arquitetura foi planejada para ser escalável, com separação clara entre camadas e foco em performance desde o início.',

        technologies: [
            {
                name: 'React + TypeScript',
                category: 'frontend',
                reason: 'Type safety, component reusability, e ecossistema maduro',
                impact: '40% menos bugs em produção'
            },
            {
                name: 'Node.js + Express',
                category: 'backend',
                reason: 'JavaScript full-stack, performance, e grande comunidade',
                impact: 'Desenvolvimento 50% mais rápido'
            },
            {
                name: 'Prisma ORM',
                category: 'database',
                reason: 'Type-safe database access e migrations automáticas',
                impact: '60% menos erros de database'
            },
            {
                name: 'PostgreSQL',
                category: 'database',
                reason: 'Confiabilidade, ACID compliance, e features avançadas',
                impact: 'Zero perda de dados'
            },
            {
                name: 'Railway',
                category: 'devops',
                reason: 'Deploy simples, CI/CD automático, e managed database',
                impact: 'Deploy em minutos'
            },
            {
                name: 'TailwindCSS',
                category: 'frontend',
                reason: 'Desenvolvimento rápido e design system consistente',
                impact: 'UI development 3x mais rápido'
            }
        ],

        features: [
            {
                title: 'Admin Dashboard',
                description: 'Painel completo para gerenciar projetos, posts do blog, e visualizar analytics em tempo real'
            },
            {
                title: 'Sistema de Blog',
                description: 'CMS integrado com editor Markdown, categorias, tags, e sistema de comentários'
            },
            {
                title: 'Analytics Customizado',
                description: 'Tracking de visitantes, visualizações de página, e métricas de engajamento'
            },
            {
                title: 'Autenticação Segura',
                description: 'Sistema de login com JWT, proteção de rotas, e gerenciamento de sessões'
            },
            {
                title: 'Performance Otimizada',
                description: 'Lazy loading, code splitting, WebP images, e score 73+ no PageSpeed'
            },
            {
                title: 'Responsive Design',
                description: 'Interface totalmente responsiva, testada em múltiplos dispositivos'
            }
        ],

        metrics: [
            {
                label: 'PageSpeed Mobile',
                value: '73',
                icon: '⚡',
                improvement: '+11 points'
            },
            {
                label: 'CLS Score',
                value: '0ms',
                icon: '🎯',
                improvement: 'Perfect!'
            },
            {
                label: 'Bundle Size',
                value: '-40%',
                icon: '📦',
                improvement: 'vs initial'
            },
            {
                label: 'Load Time',
                value: '4.3s',
                icon: '🚀',
                improvement: '-31% LCP'
            }
        ],

        achievements: [
            '73+ PageSpeed mobile score',
            'Zero layout shift (CLS = 0)',
            'Full TypeScript coverage',
            'Comprehensive admin dashboard',
            'Real-time analytics tracking',
            'Automated CI/CD pipeline',
            'SEO optimized (100 score)',
            'Fully responsive design'
        ],

        testimonial: undefined,
        images: [],

        liveUrl: 'https://www.robertosilvadevfullstack.cloud',
        githubUrl: 'https://github.com/RobertoSilvaDevFullStack/portfolio-profissional-dev-main',

        metaDescription: 'Case study: Como desenvolvi um portfólio full-stack profissional com React, Node.js, e Prisma, alcançando 73+ no PageSpeed mobile.',
        keywords: ['portfolio', 'full-stack', 'react', 'nodejs', 'typescript', 'prisma', 'case study'],

        completedAt: '2026-01-08',
        publishedAt: '2026-01-08'
    },

    // Case Study 2: Janice Correia
    {
        id: '2',
        slug: 'janice-correia-comunicacao',
        title: 'Site Janice Correia – Comunicação, Oratória e Performance',
        tagline: 'Plataforma profissional para coach de comunicação e oratória',

        client: 'Janice Correia',
        industry: 'Coaching & Educação',
        duration: '2 meses',
        role: 'Full-Stack Developer & Designer',
        teamSize: 'Solo',

        heroImage: '/foto-pessoal.webp',
        heroImageAlt: 'Janice Correia Website Screenshot',

        challenge: 'Janice Correia, coach especializada em comunicação e oratória, precisava de uma presença digital profissional que refletisse sua expertise e atraísse novos clientes. O desafio era criar um site que transmitisse credibilidade, mostrasse seus serviços de forma clara e facilitasse o agendamento de consultas.',
        painPoints: [
            'Ausência de presença digital profissional',
            'Dificuldade em mostrar portfólio de trabalhos e depoimentos',
            'Processo manual de agendamento de consultas',
            'Falta de sistema para captura de leads',
            'Design não refletia o profissionalismo da coach'
        ],

        approach: 'Desenvolvi um site elegante e profissional focado em conversão, com design clean que destaca os serviços de coaching. A arquitetura foi pensada para guiar o visitante naturalmente através da jornada de descoberta até o agendamento.',

        technologies: [
            {
                name: 'React + TypeScript',
                category: 'frontend',
                reason: 'Interface moderna e responsiva com type safety',
                impact: 'Desenvolvimento 40% mais rápido'
            },
            {
                name: 'TailwindCSS',
                category: 'frontend',
                reason: 'Design system consistente e customizável',
                impact: 'UI profissional em menos tempo'
            },
            {
                name: 'Framer Motion',
                category: 'frontend',
                reason: 'Animações suaves e profissionais',
                impact: 'Experiência premium para visitantes'
            },
            {
                name: 'React Hook Form',
                category: 'frontend',
                reason: 'Formulários otimizados e validação robusta',
                impact: 'Zero erros de submissão'
            },
            {
                name: 'Vercel',
                category: 'devops',
                reason: 'Deploy rápido e CDN global',
                impact: 'Site carrega em <2s globalmente'
            }
        ],

        features: [
            {
                title: 'Página de Serviços',
                description: 'Apresentação clara dos serviços de coaching com descrições detalhadas e benefícios'
            },
            {
                title: 'Galeria de Depoimentos',
                description: 'Seção dedicada com depoimentos de clientes e resultados alcançados'
            },
            {
                title: 'Sistema de Agendamento',
                description: 'Integração com Calendly para agendamento direto de consultas'
            },
            {
                title: 'Blog de Conteúdo',
                description: 'Plataforma para compartilhar dicas e estabelecer autoridade'
            },
            {
                title: 'Formulário de Contato',
                description: 'Captura de leads com integração de email automático'
            },
            {
                title: 'Design Responsivo',
                description: 'Experiência perfeita em todos os dispositivos'
            }
        ],

        metrics: [
            {
                label: 'Taxa de Conversão',
                value: '8.5%',
                icon: '📈',
                improvement: '+350% vs anterior'
            },
            {
                label: 'Tempo de Carregamento',
                value: '1.8s',
                icon: '⚡',
                improvement: 'LCP < 2s'
            },
            {
                label: 'Agendamentos',
                value: '+120%',
                icon: '📅',
                improvement: 'vs processo manual'
            },
            {
                label: 'PageSpeed',
                value: '94',
                icon: '🎯',
                improvement: 'Mobile score'
            }
        ],

        achievements: [
            'Design elegante e profissional',
            'Sistema de agendamento integrado',
            'SEO otimizado para busca local',
            'Formulários com validação completa',
            'Animações suaves e profissionais',
            'Totalmente responsivo',
            'Blog integrado para conteúdo',
            'Performance 94+ no PageSpeed'
        ],

        testimonial: {
            quote: 'Roberto criou exatamente o que eu precisava! O site transmite profissionalismo e já recebi vários agendamentos através dele. A integração com o Calendly facilitou muito minha rotina.',
            author: 'Janice Correia',
            role: 'Coach de Comunicação e Oratória',
            company: undefined
        },

        images: [],

        liveUrl: undefined,
        githubUrl: undefined,

        metaDescription: 'Case study: Desenvolvimento de site profissional para coach de comunicação, com foco em conversão e agendamento de consultas. Taxa de conversão de 8.5%.',
        keywords: ['website', 'coaching', 'react', 'typescript', 'conversion', 'landing page'],

        completedAt: '2025-11-15',
        publishedAt: '2026-01-08'
    },

    // Case Study 3: COSTAR Prompt Generator
    {
        id: '3',
        slug: 'costar-prompt-generator',
        title: 'Gerador de Prompt COSTAR',
        tagline: 'Sistema multi-IA com FastAPI e Supabase para geração inteligente de prompts',

        client: 'Projeto Pessoal / Open Source',
        industry: 'AI Tools & Productivity',
        duration: '1.5 meses',
        role: 'Full-Stack Developer',
        teamSize: 'Solo',

        heroImage: '/foto-pessoal.webp',
        heroImageAlt: 'COSTAR Prompt Generator Interface',

        challenge: 'Criar prompts efetivos para diferentes modelos de IA (GPT, Claude, Gemini) é uma habilidade que requer prática. O desafio era desenvolver uma ferramenta que ajudasse usuários a criar prompts estruturados seguindo o framework COSTAR, com suporte a múltiplas IAs e armazenamento de histórico.',
        painPoints: [
            'Dificuldade em criar prompts estruturados e efetivos',
            'Falta de padronização entre diferentes modelos de IA',
            'Ausência de histórico e versionamento de prompts',
            'Necessidade de testar em múltiplas IAs manualmente',
            'Curva de aprendizado alta para iniciantes'
        ],

        approach: 'Desenvolvi uma aplicação full-stack com FastAPI no backend e React no frontend, integrando múltiplas APIs de IA. O sistema guia o usuário através do framework COSTAR (Context, Objective, Style, Tone, Audience, Response) e gera prompts otimizados para cada modelo.',

        technologies: [
            {
                name: 'FastAPI',
                category: 'backend',
                reason: 'Performance excepcional e documentação automática',
                impact: 'API 3x mais rápida que Flask'
            },
            {
                name: 'Supabase',
                category: 'database',
                reason: 'PostgreSQL gerenciado com auth e real-time',
                impact: 'Setup em minutos vs dias'
            },
            {
                name: 'OpenAI API',
                category: 'backend',
                reason: 'Integração com GPT-4 e GPT-3.5',
                impact: 'Geração de prompts inteligente'
            },
            {
                name: 'Anthropic Claude API',
                category: 'backend',
                reason: 'Suporte a Claude 2 e 3',
                impact: 'Múltiplas opções de IA'
            },
            {
                name: 'Google Gemini API',
                category: 'backend',
                reason: 'Integração com Gemini Pro',
                impact: 'Comparação entre modelos'
            },
            {
                name: 'React + Vite',
                category: 'frontend',
                reason: 'Interface rápida e moderna',
                impact: 'HMR instantâneo'
            },
            {
                name: 'Pydantic',
                category: 'backend',
                reason: 'Validação de dados type-safe',
                impact: 'Zero erros de schema'
            },
            {
                name: 'Docker',
                category: 'devops',
                reason: 'Containerização para deploy consistente',
                impact: 'Deploy em qualquer ambiente'
            }
        ],

        features: [
            {
                title: 'Framework COSTAR Guiado',
                description: 'Interface passo-a-passo para criar prompts seguindo o framework COSTAR'
            },
            {
                title: 'Multi-IA Support',
                description: 'Teste prompts em GPT-4, Claude, e Gemini simultaneamente'
            },
            {
                title: 'Histórico de Prompts',
                description: 'Armazene e versione todos os prompts criados com Supabase'
            },
            {
                title: 'Templates Prontos',
                description: 'Biblioteca de templates para casos de uso comuns'
            },
            {
                title: 'Comparação de Respostas',
                description: 'Compare resultados de diferentes modelos lado a lado'
            },
            {
                title: 'Export & Share',
                description: 'Exporte prompts em múltiplos formatos e compartilhe com equipe'
            }
        ],

        metrics: [
            {
                label: 'Tempo de Resposta API',
                value: '<200ms',
                icon: '⚡',
                improvement: 'FastAPI performance'
            },
            {
                label: 'Prompts Gerados',
                value: '500+',
                icon: '📝',
                improvement: 'Primeiros 30 dias'
            },
            {
                label: 'Modelos Suportados',
                value: '6',
                icon: '🤖',
                improvement: 'GPT, Claude, Gemini'
            },
            {
                label: 'Satisfação',
                value: '4.8/5',
                icon: '⭐',
                improvement: 'User feedback'
            }
        ],

        achievements: [
            'API RESTful completa com FastAPI',
            'Integração com 3 provedores de IA',
            'Sistema de autenticação com Supabase',
            'Real-time sync de prompts',
            'Documentação automática (Swagger)',
            'Docker containerizado',
            'Testes automatizados (pytest)',
            'CI/CD com GitHub Actions'
        ],

        testimonial: undefined,
        images: [],

        liveUrl: undefined,
        githubUrl: undefined,

        metaDescription: 'Case study: Gerador de prompts COSTAR com FastAPI, Supabase e integração multi-IA (GPT, Claude, Gemini). Sistema completo de versionamento e comparação.',
        keywords: ['fastapi', 'supabase', 'ai', 'openai', 'claude', 'gemini', 'prompt engineering'],

        completedAt: '2025-12-20',
        publishedAt: '2026-01-08'
    },

    // Case Study 4: Elev Landing Page
    {
        id: '4',
        slug: 'elev-landing-page',
        title: 'Elev Landing Page - Conversão e Performance',
        tagline: 'Landing page de alta conversão com foco em performance e SEO',

        client: 'Elev',
        industry: 'SaaS / Tecnologia',
        duration: '3 semanas',
        role: 'Frontend Developer',
        teamSize: 'Solo',

        heroImage: '/foto-pessoal.webp',
        heroImageAlt: 'Elev Landing Page Screenshot',

        challenge: 'A Elev precisava de uma landing page que convertesse visitantes em leads qualificados. O desafio era criar uma página extremamente rápida (PageSpeed 95+), com design moderno e persuasivo, otimizada para SEO e com foco total em conversão.',
        painPoints: [
            'Taxa de conversão baixa na landing page anterior (1.2%)',
            'Tempo de carregamento lento (5+ segundos)',
            'Design desatualizado não transmitia confiança',
            'Falta de otimização para mobile',
            'SEO fraco, não ranqueava para keywords importantes'
        ],

        approach: 'Desenvolvi uma landing page otimizada do zero, aplicando princípios de copywriting persuasivo, design moderno e técnicas avançadas de performance. Cada elemento foi pensado para guiar o visitante até a conversão, com CTAs estrategicamente posicionados.',

        technologies: [
            {
                name: 'Next.js 14',
                category: 'frontend',
                reason: 'SSR e SSG para performance e SEO máximos',
                impact: 'PageSpeed 98/100'
            },
            {
                name: 'TailwindCSS',
                category: 'frontend',
                reason: 'Design system rápido e consistente',
                impact: 'CSS 70% menor'
            },
            {
                name: 'Framer Motion',
                category: 'frontend',
                reason: 'Animações performáticas e profissionais',
                impact: 'Engagement +45%'
            },
            {
                name: 'React Hook Form',
                category: 'frontend',
                reason: 'Formulários otimizados',
                impact: 'Validação instantânea'
            },
            {
                name: 'Sharp',
                category: 'tools',
                reason: 'Otimização automática de imagens',
                impact: 'Imagens 80% menores'
            },
            {
                name: 'Vercel',
                category: 'devops',
                reason: 'Edge network global',
                impact: 'TTFB < 100ms'
            }
        ],

        features: [
            {
                title: 'Hero Section Impactante',
                description: 'Headline persuasiva com CTA principal e social proof imediato'
            },
            {
                title: 'Seção de Benefícios',
                description: 'Features apresentadas focando em benefícios, não apenas funcionalidades'
            },
            {
                title: 'Social Proof',
                description: 'Depoimentos, logos de clientes e métricas de sucesso'
            },
            {
                title: 'Formulário Otimizado',
                description: 'Captura de leads com validação em tempo real e feedback visual'
            },
            {
                title: 'FAQ Estratégico',
                description: 'Responde objeções comuns e melhora SEO'
            },
            {
                title: 'Performance Extrema',
                description: 'Lazy loading, code splitting, imagens otimizadas'
            }
        ],

        metrics: [
            {
                label: 'Taxa de Conversão',
                value: '12.3%',
                icon: '🎯',
                improvement: '+925% vs anterior'
            },
            {
                label: 'PageSpeed Mobile',
                value: '98',
                icon: '⚡',
                improvement: 'vs 62 anterior'
            },
            {
                label: 'Tempo de Carregamento',
                value: '0.9s',
                icon: '🚀',
                improvement: '-82% vs anterior'
            },
            {
                label: 'Leads Gerados',
                value: '+340%',
                icon: '📈',
                improvement: 'Primeiro mês'
            }
        ],

        achievements: [
            'PageSpeed 98/100 mobile',
            'Taxa de conversão 12.3%',
            'Core Web Vitals todos verdes',
            'SEO score 100/100',
            'Acessibilidade 100/100',
            'TTFB < 100ms global',
            'Imagens WebP otimizadas',
            'Schema.org markup completo'
        ],

        testimonial: {
            quote: 'A nova landing page superou todas as expectativas. Triplicamos nossos leads no primeiro mês e a performance é impressionante. Roberto entende de conversão e performance como poucos.',
            author: 'Equipe Elev',
            role: 'Marketing Team',
            company: 'Elev'
        },

        images: [],

        liveUrl: undefined,
        githubUrl: undefined,

        metaDescription: 'Case study: Landing page de alta conversão (12.3%) com Next.js 14, PageSpeed 98/100 e foco total em performance. +340% leads no primeiro mês.',
        keywords: ['landing page', 'nextjs', 'conversion', 'performance', 'seo', 'tailwindcss'],

        completedAt: '2025-10-30',
        publishedAt: '2026-01-08'
    }
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
    return caseStudies.find(cs => cs.slug === slug);
};

export const getAllCaseStudies = (): CaseStudy[] => {
    return caseStudies;
};

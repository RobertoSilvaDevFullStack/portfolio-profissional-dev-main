import type { CaseStudy } from '@/types/caseStudy';

// Example case study - Replace with real data
export const caseStudies: CaseStudy[] = [
    {
        id: '1',
        slug: 'portfolio-full-stack',
        title: 'Portfolio Full-Stack Profissional',
        tagline: 'Plataforma completa de portfólio com admin dashboard e analytics',

        // Meta
        client: 'Projeto Pessoal',
        industry: 'Web Development',
        duration: '3 meses',
        role: 'Full-Stack Developer',
        teamSize: 'Solo',

        // Hero
        heroImage: '/foto-pessoal.webp',
        heroImageAlt: 'Portfolio Screenshot',

        // Problem
        challenge: 'Precisava de um portfólio profissional que não apenas mostrasse meus projetos, mas também demonstrasse minhas habilidades técnicas de forma prática. O desafio era criar uma aplicação full-stack completa, com backend robusto, admin dashboard funcional, e performance otimizada.',
        painPoints: [
            'Portfólios tradicionais são estáticos e não demonstram habilidades backend',
            'Falta de sistema de gerenciamento de conteúdo integrado',
            'Performance mobile geralmente negligenciada',
            'Ausência de analytics e métricas de visitantes'
        ],

        // Solution
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

        // Results
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

        testimonial: undefined, // Personal project

        // Gallery
        images: [],

        // Links
        liveUrl: 'https://www.robertosilvadevfullstack.cloud',
        githubUrl: 'https://github.com/RobertoSilvaDevFullStack/portfolio-profissional-dev-main',

        // SEO
        metaDescription: 'Case study: Como desenvolvi um portfólio full-stack profissional com React, Node.js, e Prisma, alcançando 73+ no PageSpeed mobile.',
        keywords: ['portfolio', 'full-stack', 'react', 'nodejs', 'typescript', 'prisma', 'case study'],

        // Dates
        completedAt: '2026-01-08',
        publishedAt: '2026-01-08'
    }
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
    return caseStudies.find(cs => cs.slug === slug);
};

export const getAllCaseStudies = (): CaseStudy[] => {
    return caseStudies;
};
